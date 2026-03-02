  import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent {
    isPositiveChange(): boolean {
      return this.changeType === 'positive';
    }
  @Input() icon: string = '';
  @Input() iconColor: string = '#5d87ff';
  @Input() label: string = '';
  @Input() value: string = '';
  @Input() change?: string;
  @Input() changeType: 'positive' | 'negative' | 'neutral' = 'neutral';
  @Input() changeIcon?: string;
  @Input() actionLabel?: string;
  @Input() actionColor?: string;
}
