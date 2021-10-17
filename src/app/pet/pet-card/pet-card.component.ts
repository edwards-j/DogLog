import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pet-card',
  templateUrl: './pet-card.component.html',
  styleUrls: ['./pet-card.component.css']
})
export class PetCardComponent implements OnInit {

  constructor() { }

  @Input() petInfo: any;

  ngOnInit(): void {
  }

}
