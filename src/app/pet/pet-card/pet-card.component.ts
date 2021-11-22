import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pet-card',
  templateUrl: './pet-card.component.html',
  styleUrls: ['./pet-card.component.css']
})
export class PetCardComponent implements OnInit {

  constructor() { }

  @Input() petInfo: any;
  petIconSource: string;

  ngOnInit(): void {
    switch (this.petInfo.species) {
      case 'dog':
        this.petIconSource = '../../../assets/dog.png'
        break;
      case 'cat':
        this.petIconSource = '../../../assets/cat.png'
        break;
      default:
        break;
    }
  }

}
