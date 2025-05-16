import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  errorCode: string = 'Error';
  errorMessage: string = 'Something went wrong.';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let code = params.get('code');
  
      // If no route param, check query param
      if (!code) {
        this.route.queryParamMap.subscribe(queryParams => {
          code = queryParams.get('code') || 'Error';
          this.setErrorMessage(code);
        });
      } else {
        this.setErrorMessage(code);
      }
    });
  }
  
  setErrorMessage(code: string | null) {
    switch (code) {
      case '404':
        this.errorCode = '404';
        this.errorMessage = "Oops! The page you're looking for doesn't exist.";
        break;
      case '403':
        this.errorCode = '403';
        this.errorMessage = "Access Denied! You don't have permission to view this page.";
        break;
      case '500':
        this.errorCode = '500';
        this.errorMessage = "Internal Server Error! Something went wrong.";
        break;
      default:
        this.errorCode = 'Error';
        this.errorMessage = 'Something went wrong.';
    }
  }
}  