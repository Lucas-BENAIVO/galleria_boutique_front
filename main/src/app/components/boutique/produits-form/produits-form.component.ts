import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../services/product.service';
import { Category } from '../../../services/category.service';

@Component({
  selector: 'app-produits-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produits-form.component.html',
  styleUrls: ['./produits-form.component.scss']
})
export class ProduitsFormComponent implements OnInit, OnChanges {
  @Input() product: Product | null = null;
  @Input() categories: Category[] = [];
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  formData = {
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    isActive: true,
    images: [] as string[]
  };

  imageUrl = '';

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product']) {
      this.initForm();
    }
  }

  private initForm() {
    if (this.product) {
      this.formData = {
        name: this.product.name || '',
        description: this.product.description || '',
        price: this.product.price || 0,
        categoryId: this.product.categoryId || '',
        isActive: this.product.isActive ?? true,
        images: this.product.images || []
      };
    } else {
      this.formData = {
        name: '',
        description: '',
        price: 0,
        categoryId: '',
        isActive: true,
        images: []
      };
    }
  }

  addImage() {
    if (this.imageUrl.trim()) {
      this.formData.images.push(this.imageUrl.trim());
      this.imageUrl = '';
    }
  }

  removeImage(index: number) {
    this.formData.images.splice(index, 1);
  }

  submit() {
    this.save.emit(this.formData);
  }

  close() {
    this.cancel.emit();
  }
}
