import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-promotions-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './promotions-form.component.html',
  styleUrls: ['./promotions-form.component.scss']
})
export class PromotionsFormComponent implements OnInit, OnChanges {
  @Input() promotion: any = null;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  formData = {
    title: '',
    discountPercent: 10,
    startDate: '',
    endDate: ''
  };

  ngOnInit() {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['promotion']) {
      this.loadData();
    }
  }

  loadData() {
    if (this.promotion) {
      this.formData = {
        title: this.promotion.title || '',
        discountPercent: this.promotion.discountPercent || 10,
        startDate: this.formatDateForInput(this.promotion.startDate),
        endDate: this.formatDateForInput(this.promotion.endDate)
      };
    } else {
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      this.formData = {
        title: '',
        discountPercent: 10,
        startDate: this.formatDateForInput(today.toISOString()),
        endDate: this.formatDateForInput(nextMonth.toISOString())
      };
    }
  }

  formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  }

  submit() {
    this.save.emit({ ...this.formData });
  }

  close() {
    this.cancel.emit();
  }
}