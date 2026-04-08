import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EvaluationService } from '../evaluation.service';
import { Observable, Subscription } from 'rxjs';
import { MarkdownModule } from 'ngx-markdown';
import { convert } from 'html-to-text';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VoiceService } from '../voice.service';

@Component({
  selector: 'app-explanation',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MarkdownModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './explanation.component.html',
  styleUrls: ['./explanation.component.css'],
})
export class ExplanationComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() lessonId!: number;
  @Input() lessonsectionId!: number;
  @Input() explanationText: SafeHtml = 'This is a default explanation.';

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  explanation: string = '';
  chatHistory: { role: string; content: string }[] = [];
  activeSubscription: Subscription | null = null;
  responseSubscription: Subscription | null = null;

  prompt: string = '';
  responseText: string = ''; 
  response$?: Observable<string>; 
  isLoading: boolean = false;
  errorMessage: string = '';
  loadingExplanation: boolean = true;
  scrollRequired: boolean = false;
  isSpeaking: boolean = false;
  speechSynthesis: SpeechSynthesis;

  constructor(
    private sanitizer: DomSanitizer,
    private evaluationService: EvaluationService,
    private voiceService: VoiceService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {
    this.speechSynthesis = window.speechSynthesis;
  }

  
  recognition: SpeechRecognition | null = null;
  isRecording: boolean = false;
  isSpeechRecognitionSupported: boolean = false;

  private load() {
    this.loadingExplanation = true;
    this.activeSubscription = this.evaluationService
      .getLessonExplanation(this.lessonsectionId)
      .subscribe({
        next: (data) => {
          this.explanation = data;
          this.explanationText = this.sanitizer.bypassSecurityTrustHtml(
            this.explanation
          );
          this.loadingExplanation = false;
        },
        error: (error) => {
          console.error('Error loading explanation:', error);
          this.loadingExplanation = false;
          this.showNotification('Error loading explanation content');
        }
      });
  }

  ngOnInit() {
    this.load();
  }

  ngAfterViewChecked() {
    
    if (this.scrollRequired) {
      this.scrollToBottom();
      this.scrollRequired = false;
    }
  }

  ngOnDestroy() {
    if (this.activeSubscription) {
      this.activeSubscription.unsubscribe();
    }
    if (this.responseSubscription) {
      this.responseSubscription.unsubscribe();
    }
  }

  isInteractiveMode = false;
  isInteractive(): boolean {
    return this.isInteractiveMode;
  }

  toggleSpeaking(messageContent: string) {
    this.isSpeaking = !this.isSpeaking
    if (this.isSpeaking) {
      this.voiceService.speak(messageContent);
    } else {
      this.voiceService.stopSpeaking();
    } 
  }

  toggleInteractiveMode() {
    this.isInteractiveMode = !this.isInteractiveMode;
    if (this.isInteractiveMode) {
      let textExplanation = this.convertHtmlToPlainText(this.explanation);
      this.voiceService.speak(textExplanation);
    } else {
      this.voiceService.stopSpeaking();
    }
  }

  sendQuestion() {
    if (!this.prompt.trim()) {
      this.errorMessage = 'Please enter a question to continue.';
      this.showNotification('Please enter a question');
      return;
    }
   
    const userQuestion = this.prompt.trim();
   
    this.prompt = '';
    this.errorMessage = '';
    this.isLoading = true;

    
    this.chatHistory.push({ role: 'user', content: userQuestion });
    this.scrollRequired = true;

    
    this.responseText = '';

    let textExplanation = this.convertHtmlToPlainText(this.explanation);

    let modifiedPrompt =
    `Use only brief answer unless asked explicitly to explain in detail.
    Be crisp and clear. Answer the question within the context only. \n\n The question is: ${userQuestion}.
    Else simply mention 'You are asking question outside the context'
    `;

    try {
      this.response$ = this.evaluationService.generateResponse(modifiedPrompt);
      this.responseSubscription = this.response$.subscribe({
        next: (chunk) => {
          this.responseText += chunk;
          this.scrollRequired = true;
        },
        error: (error) => {
          this.errorMessage = 'Error fetching response. Please try again.';
          this.isLoading = false;
          console.error('Error:', error);
          this.showNotification('Failed to get response');
        },
        complete: () => {
          
          this.chatHistory.push({ role: 'assistant', content: this.responseText });
          this.isLoading = false;
          this.scrollRequired = true;
        }
      });
    } catch (err) {
      this.errorMessage = 'Failed to send request. Please try again.';
      this.isLoading = false;
      console.error('Send error:', err);
    }
  }

  stopResponse() {
    try {
      this.evaluationService.stopGeneration();
      this.isLoading = false;
      this.showNotification('Response generation stopped');

      if (this.responseSubscription) {
        this.responseSubscription.unsubscribe();
        this.responseSubscription = null;
      }
    } catch (err) {
      console.error('Error stopping response:', err);
    }
  }

  clearChat() {
    this.responseText = '';
    this.chatHistory = [];
    this.showNotification('Chat history cleared');
  }

  private scrollToBottom() {
    if (this.messagesContainer) {
      try {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Error scrolling to bottom:', err);
      }
    }
  }

  private convertHtmlToPlainText(htmlText: string) {
    try {
      let plainText = convert(htmlText, {
        wordwrap: 130, 
        selectors: [
          { selector: 'a', options: { ignoreHref: true } },
          { selector: 'img', format: 'skip' }
        ]
      });

      plainText = plainText.replace(/[\p{Emoji}\p{Symbol}]/gu, '');
      return plainText;
    } catch (err) {
      console.error('Error converting HTML to text:', err);
      return htmlText || '';
    }
  }

  showNotification(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['notification-snackbar']
    });
  }

  askQuestion() {
    this.voiceService.stopSpeaking();
    this.voiceService.listen((heard) => {
      if (heard != null && heard.trim() !== '') {
        this.prompt = heard;
        this.sendQuestion();
      } else {
        console.warn('Voice input was empty or whitespace.');
      }
    });

  }
}
