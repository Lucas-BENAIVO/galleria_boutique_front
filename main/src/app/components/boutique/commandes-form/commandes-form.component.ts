import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-commandes-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commandes-form.component.html',
  styleUrls: ['./commandes-form.component.scss']
})
export class CommandesFormComponent implements OnInit {
  @Input() commande: any = null;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  formData = {
    client: '',
    date: '',
    total: '',
    status: 'En cours'
  };

  ngOnInit() {
    if (this.commande) {
      this.formData = { ...this.commande };
    }
  }

  submit() {
    this.save.emit({ ...this.formData });
  }

  close() {
    this.cancel.emit();
  }
}