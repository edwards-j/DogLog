import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-walkthrough',
  templateUrl: './walkthrough.component.html',
  styleUrls: ['./walkthrough.component.css']
})
export class WalkthroughComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateHome() {
    this.router.navigate(['/home']);
  }

}
