import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
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
export class ExplanationComponent implements OnInit, OnDestroy {
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

  constructor(
    private sanitizer: DomSanitizer,
    private evaluationService: EvaluationService,
    private snackBar: MatSnackBar
  ) {}

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
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnDestroy() {
    if (this.activeSubscription) {
      this.activeSubscription.unsubscribe();
    }
    if (this.responseSubscription) {
      this.responseSubscription.unsubscribe();
    }
  }

  sendQuestion() {
    if (!this.prompt.trim()) {
      this.errorMessage = 'Please enter a question to continue.';
      this.showNotification('Please enter a question');
      return;
    }

    // Save user question to chat history
    this.chatHistory.push({ role: 'user', content: this.prompt });
    
    const userQuestion = this.prompt;
    this.errorMessage = '';
    this.isLoading = true;
    
    // Clear input immediately for better UX
    this.prompt = '';
    
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
          this.scrollToBottom();
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
          
          this.responseText += '\n\n\n';
          this.isLoading = false;
          this.scrollToBottom();
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
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 100);
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
}










// import { CommonModule } from '@angular/common';
// import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
// import { MatCardModule } from '@angular/material/card';
// import { MatIconModule } from '@angular/material/icon';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { FormsModule } from '@angular/forms';
// import { MatInputModule } from '@angular/material/input';
// import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
// import { EvaluationService } from '../evaluation.service';
// import { Observable } from 'rxjs';
// import { MarkdownModule } from 'ngx-markdown';
// import { convert } from 'html-to-text';

// @Component({
//   selector: 'app-explanation',
//   imports: [
//     CommonModule,
//     MatCardModule,
//     MatIconModule,
//     FormsModule,
//     MatInputModule,
//     MatFormFieldModule,
//     MarkdownModule,
//   ],
//   templateUrl: './explanation.component.html',
//   styleUrls: ['./explanation.component.css'],
// })
// export class ExplanationComponent implements OnInit {
//   @Input() lessonId!: number;
//   @Input() lessonsectionId!: number;
//   @Input() explanationText: SafeHtml = 'This is a default explanation.';

//   @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

//   explanation: string = '';
//   activeSubscription: any;

//   prompt: string = '';
//   responseText: string = ''; // Store accumulated response
//   response$?: Observable<string>; // Observable for streaming
//   isLoading: boolean = false;
//   errorMessage: string = '';

//   constructor(
//     private sanitizer: DomSanitizer,
//     private evaluationService: EvaluationService
//   ) {}

//   // Load the questions
//   private load() {
//     this.activeSubscription = this.evaluationService
//       .getLessonExplanation(this.lessonsectionId)
//       .subscribe((data) => {
//         this.explanation = data;
//         this.explanationText = this.sanitizer.bypassSecurityTrustHtml(
//           this.explanation
//         );
//       });
//   }

//   ngOnInit() {
//     this.load();
//   }
//   ngAfterViewInit() {
//     this.scrollToBottom();
//   }

//   sendQuestion() {
//     if (!this.prompt.trim()) {
//       this.errorMessage = 'Please enter a prompt.';
//       return;
//     }

//     this.errorMessage = '';
//     this.isLoading = true;
//     let textExplanation = this.convertHtmlToPlainText(this.explanation);

//     let modifiedPrompt =
//       //`The context is: \n ${textExplanation}.\n\n
//       `Use only brief answer unless asked explicitly to explain in detail.
//     Be crisp and clear. Answer the question within the context only. \n\n The question is: ${this.prompt}.
//     Else simply mention 'You are asking question outside the context'
//     `;
//     this.response$ = this.evaluationService.generateResponse(modifiedPrompt);
//     this.response$.subscribe(
//       (chunk) => {
//         this.responseText += chunk;
//         this.scrollToBottom();
//       },
//       (error) => {
//         this.errorMessage = 'Error fetching response. Please try again.';
//         console.error('Error:', error);
//       },
//       () => {
//         this.responseText += '\n\n\n';
//         this.prompt = '';
//         this.isLoading = false;
//       }
//     );
//   }

//   stopResponse() {
//     this.evaluationService.stopGeneration();
//     this.isLoading = false;
//   }

//   private scrollToBottom() {
//     setTimeout(() => {
//       if (this.messagesContainer) {
//         this.messagesContainer.nativeElement.scrollTop =
//           this.messagesContainer.nativeElement.scrollHeight;
//       }
//     }, 100);
//   }

//   private convertHtmlToPlainText(htmlText: string) {
//     let plainText = convert(htmlText, {
//       wordwrap: 130, // Adjust line breaks for better readability
//     });

//     plainText = plainText.replace(/[\p{Emoji}\p{Symbol}]/gu, '');

//     return plainText;
//   }
// }
