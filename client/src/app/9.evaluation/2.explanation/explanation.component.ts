import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy, AfterViewChecked } from '@angular/core';
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
  responseText: string = ''; // Store accumulated response
  response$?: Observable<string>; // Observable for streaming
  isLoading: boolean = false;
  errorMessage: string = '';
  loadingExplanation: boolean = true;
  scrollRequired: boolean = false;
  isSpeaking: boolean = false;
  speechSynthesis: SpeechSynthesis;

  constructor(
    private sanitizer: DomSanitizer,
    private evaluationService: EvaluationService,
    private snackBar: MatSnackBar
  ) {
    this.speechSynthesis = window.speechSynthesis;
  }

  // Speech recognition properties
  recognition: SpeechRecognition | null = null;
  isRecording: boolean = false;
  isSpeechRecognitionSupported: boolean = false;


  // Load the questions
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
    this.initSpeechRecognition();
  }

  ngAfterViewChecked() {
    // Handle scroll updates after view checks
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
    // Clean up speech recognition
    this.stopSpeechRecognition();
  }

  sendQuestion() {
    if (!this.prompt.trim()) {
      this.errorMessage = 'Please enter a question to continue.';
      this.showNotification('Please enter a question');
      return;
    }

    // Store the user's question before clearing the input
    const userQuestion = this.prompt.trim();

    // Clear input immediately for better UX
    this.prompt = '';
    this.errorMessage = '';
    this.isLoading = true;

    // Add user message to chat history
    this.chatHistory.push({ role: 'user', content: userQuestion });
    this.scrollRequired = true;

    // Reset response text for new conversation
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
          // Save assistant response to chat history
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
        wordwrap: 130, // Adjust line breaks for better readability
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

  // Speech recognition methods
  private initSpeechRecognition() {
    // Check if browser supports speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      this.isSpeechRecognitionSupported = true;

      // Create speech recognition instance
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();

      // Configure recognition
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      // Set up event handlers
      this.recognition.onstart = () => {
        this.isRecording = true;
      };

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');

        // Update the prompt with the transcript
        this.prompt = transcript;

        // If we have a final result
        if (event.results[0].isFinal) {
          setTimeout(() => {
            this.stopSpeechRecognition();
          }, 1000);
        }
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);

        let message = '';
        switch(event.error) {
          case 'not-allowed':
            message = 'Microphone access denied. Please allow microphone access.';
            break;
          case 'no-speech':
            message = 'No speech detected. Please try again.';
            break;
          case 'network':
            message = 'Network error occurred. Please check your connection.';
            break;
          default:
            message = `Error: ${event.error}. Please try again.`;
        }

        this.errorMessage = message;
        this.stopSpeechRecognition();
      };

      this.recognition.onend = () => {
        this.isRecording = false;
      };
    } else {
      this.isSpeechRecognitionSupported = false;
      console.warn('Speech recognition is not supported in this browser.');
    }
  }

  toggleSpeechRecognition() {
    if (!this.isSpeechRecognitionSupported) {
      this.errorMessage = 'Speech recognition is not supported in this browser.';
      this.showNotification('Speech recognition not supported');
      return;
    }

    if (this.isRecording) {
      this.stopSpeechRecognition();
    } else {
      this.startSpeechRecognition();
    }
  }

  private startSpeechRecognition() {
    if (this.recognition && !this.isRecording) {
      this.errorMessage = '';
      try {
        this.recognition.start();
        this.showNotification('Listening...');
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        this.errorMessage = 'Error starting speech recognition. Please try again.';
      }
    }
  }

  private stopSpeechRecognition() {
    if (this.recognition && this.isRecording) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  }

  speak(text: string) {
    if (this.isSpeaking) {
      this.stopSpeaking();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      this.isSpeaking = false;
    };
    this.isSpeaking = true;
    this.speechSynthesis.speak(utterance);
  }

  stopSpeaking() {
    this.speechSynthesis.cancel();
    this.isSpeaking = false;
  }
}
