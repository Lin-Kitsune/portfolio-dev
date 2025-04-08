import { NgFor, AsyncPipe, DecimalPipe, NgIf, CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';
import { Firestore, collection, collectionData, query, where, orderBy, limit, getDocs } from '@angular/fire/firestore';
import { Router } from '@angular/router';

import { CategoryService, Category } from '../../Service/category.service';
import { ProductService } from '../../Service/product.service';
import { Product } from '../../models/product.model';
import { CartService } from '../../Service/cart.service';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgIf, DecimalPipe, CommonModule, FormsModule], 
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit, AfterViewInit {
  topProducts: Product[] = [];
  categories: Category[] = [];
  cafesTop: Product[] = [];
  comidaTop: Product[] = [];
  products: Product[] = [];
  
  @ViewChild('categorySlider') categorySliderRef!: ElementRef<HTMLElement>;
  sliderCategory!: KeenSliderInstance;
  @ViewChild('productSlider') productSliderRef!: ElementRef<HTMLElement>;
  sliderProduct!: KeenSliderInstance;  

  @ViewChild('comidaSlider') comidaSliderRef!: ElementRef;
  @ViewChild('cafeSlider') cafeSliderRef!: ElementRef;


  @ViewChild('opinionesScroll') opinionesScrollRef!: ElementRef<HTMLElement>;
  isDragging = false;
  startX = 0;
  scrollLeft = 0;


  selectedProduct: Product | null = null; 
  selectedSize: 'normal' | 'mediano' | 'grande' | '' = '';
  selectedMilk: string = '';
  selectedSugar: string = '';

  milks: string[] = [];
  sugars: string[] = [];
  publicas: any[] = [];
  opinionesVisibles: any[] = [];
  indiceOpiniones = 0;
  intervaloOpiniones: any = null;

  private intervalIdCategory: any;
  private intervalIdProduct: any;
  sliderComida: KeenSliderInstance | undefined;
  intervalIdComida: any;
  private cartService = inject(CartService);
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);
  private firestore = inject(Firestore);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
  
      const topVendidos = [...data]
        .filter(p => p.stock && p.stock > 0)
        .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  
      // Filtrar cafés
      this.cafesTop = topVendidos.filter(p =>
        p.category?.toLowerCase().includes('café') ||
        p.category?.toLowerCase().includes('cafés')
      );      
  
      // Filtrar comida
      const categoriasComida = ['bagels', 'ensaladas', 'para comer', 'dulces'];
      this.comidaTop = topVendidos.filter(p =>
        categoriasComida.includes(p.category?.toLowerCase())
      ).slice(0, 6);
    });
  
    this.categoryService.getCategories().subscribe(data => this.categories = data);
    this.loadIngredients();
    this.loadSugerenciasPublicas();
  }
  

  async loadSugerenciasPublicas() {
    const sugerenciasRef = collection(this.firestore, 'suggestions');
    const q = query(
      sugerenciasRef,
      where('permitePublicar', '==', true),
      orderBy('fecha', 'desc')
    );
  
    try {
      const snapshot = await getDocs(q);
      const sugerencias = snapshot.docs.map(doc => doc.data());
  
      const usersRef = collection(this.firestore, 'users');
      const usersSnapshot = await getDocs(usersRef);
      const users = usersSnapshot.docs.map(doc => doc.data());
  
      this.publicas = sugerencias.map(sug => {
        const usuario = users.find(u =>
          u['email'].toLowerCase() === sug['correo'].toLowerCase());
        console.log('Opinión:', sug['correo'], '| Usuario encontrado:', usuario?.['name']);
        return {
          ...sug,
          nombre: usuario?.['name'] || 'Usuario',
        };
      });
      
  
      this.actualizarOpinionesVisibles();
    } catch (error) {
      console.error('Error al cargar opiniones públicas:', error);
    }
  }
  

  startDrag(event: MouseEvent) {
    this.isDragging = true;
    const slider = this.opinionesScrollRef.nativeElement;
    this.startX = event.pageX - slider.offsetLeft;
    this.scrollLeft = slider.scrollLeft;
  }
  
  onDrag(event: MouseEvent) {
    if (!this.isDragging) return;
    event.preventDefault();
    const slider = this.opinionesScrollRef.nativeElement;
    const x = event.pageX - slider.offsetLeft;
    const walk = (x - this.startX) * 1.5; // sensibilidad
    slider.scrollLeft = this.scrollLeft - walk;
  }
  
  endDrag() {
    this.isDragging = false;
  }
  

  actualizarOpinionesVisibles() {
    const total = this.publicas.length;
    if (total === 0) return;
  
    const fin = this.indiceOpiniones + 5;
    this.opinionesVisibles = this.publicas.slice(this.indiceOpiniones, fin);
  
    // Si llegamos al final, reinicia
    this.indiceOpiniones = fin >= total ? 0 : fin;
  }
  

  loadIngredients() {
    const ingredientsRef = collection(this.firestore, 'inventory'); // ✅ nombre correcto de la colección
    collectionData(ingredientsRef, { idField: 'id' }).subscribe((ingredients: any[]) => {
      this.milks = ingredients.filter(i => i.type === 'milk').map(i => i.name);
      this.sugars = ingredients.filter(i => i.type === 'sugar').map(i => i.name);
    });
  }

  initCategorySlider() {
    const perView = this.categories.length < 6 ? 3 : 5;
    this.sliderCategory = new KeenSlider(this.categorySliderRef.nativeElement, {
      loop: true,
      slides: {
        origin: 'center',
        perView,
        spacing: 10,

      },
      breakpoints: {
        '(max-width: 1024px)': {
          slides: { perView: 3, spacing: 10 },
        },
        '(max-width: 640px)': {
          slides: { perView: 1.3, spacing: 8 },
        },
      },
    }, [AutoplayPlugin]);
  }
  
  initProductSlider() {
    this.sliderProduct = new KeenSlider(this.productSliderRef.nativeElement, {
      loop: true,
      slides: {
        origin: 'center',
        spacing: 10,
        perView: 4,
      },
      breakpoints: {
        '(max-width: 768px)': {
          slides: { perView: 2, spacing: 10 },
        },
        '(max-width: 480px)': {
          slides: { perView: 1.3, spacing: 8 },
        },
      },
      created: (slider) => {
        const play = () => {
          this.intervalIdProduct = setInterval(() => slider.next(), 3500);
        };
        const pause = () => clearInterval(this.intervalIdProduct);
        const el = this.productSliderRef.nativeElement;
        el.addEventListener('mouseenter', pause);
        el.addEventListener('mouseleave', play);
        play();
      },
    });
  }
  
  initComidaSlider() {
    this.sliderComida = new KeenSlider(this.comidaSliderRef.nativeElement, {
      loop: true,
      slides: {
        origin: 'center',
        spacing: 10,
        perView: 4,
      },
      breakpoints: {
        '(max-width: 768px)': {
          slides: { perView: 2, spacing: 10 },
        },
        '(max-width: 480px)': {
          slides: { perView: 1.3, spacing: 8 },
        },
      },
      created: (slider) => {
        const play = () => {
          this.intervalIdComida = setInterval(() => slider.next(), 3500);
        };
        const pause = () => clearInterval(this.intervalIdComida);
        const el = this.comidaSliderRef.nativeElement;
        el.addEventListener('mouseenter', pause);
        el.addEventListener('mouseleave', play);
        play();
      },
    });
  }  

  ngAfterViewInit(): void {
    const waitForCategories = () => {
      if (this.categories.length > 0 && this.categorySliderRef?.nativeElement) {
        this.initCategorySlider();
      } else {
        setTimeout(waitForCategories, 100);
      }
    };
  
    const waitForCafes = () => {
      if (this.cafesTop.length > 0 && this.productSliderRef?.nativeElement) {
        this.initProductSlider();
      } else {
        setTimeout(waitForCafes, 100);
      }
    };

    const waitForComida = () => {
      if (this.comidaTop.length > 0 && this.comidaSliderRef?.nativeElement) {
        this.initComidaSlider();
      } else {
        setTimeout(waitForComida, 100);
      }
    };

    waitForCategories();
    waitForCafes();
    waitForComida();
  }  

  ngOnDestroy(): void {
    clearInterval(this.intervalIdCategory);
    clearInterval(this.intervalIdProduct);
  
    // Limpiar también el intervalo de rotación de opiniones
    if (this.intervaloOpiniones) {
      clearInterval(this.intervaloOpiniones);
    }
  }
  
  loadCategories(): void {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  loadTopProducts(): void {
    this.productService.getProducts().subscribe((data) => {
      // Mostrar los más recientes, los primeros 3
      this.products = data
        .filter(p => p.stock && p.stock > 0)
        .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
        .slice(0, 3);
    });
  }

  startAutoScroll(slider: ElementRef<HTMLDivElement>, type: 'category' | 'product') {
    const scrollAmount = 300; // píxeles a desplazar
    const interval = 4000; // milisegundos

    const intervalId = setInterval(() => {
      const el = slider.nativeElement;
      if (el.scrollLeft + el.offsetWidth >= el.scrollWidth) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }, interval);

    if (type === 'category') this.intervalIdCategory = intervalId;
    else this.intervalIdProduct = intervalId;
  }

  openModal(product: Product) {
    this.selectedProduct = product;
    this.selectedSize = '';
    this.selectedMilk = '';
    this.selectedSugar = '';
  }
  
  closeModal() {
    this.selectedProduct = null;
    this.selectedSize = '';
    this.selectedMilk = '';
    this.selectedSugar = '';
  }
  
  addToCart() {
    if (
      this.selectedProduct &&
      this.selectedSize &&
      ['normal', 'mediano', 'grande'].includes(this.selectedSize)
    ) {
      const sizeConfig = this.selectedProduct.sizes.find(s => s.label === this.selectedSize);
      const price = sizeConfig?.price ?? this.selectedProduct.price;
  
      const item: CartItem = {
        ...this.selectedProduct,
        price,
        size: this.selectedSize,
        quantity: 1,
        selectedOptions: {
          milk: this.selectedMilk,
          sugar: this.selectedSugar
        }
      };
  
      this.cartService.addToCart(item);
      this.closeModal();
    } else {
      alert("Por favor, selecciona un tamaño válido.");
    }
  }
  
  getPrice(product: Product): number {
    return product.sizes?.[0]?.price || product.price;
  }

  verCategoria(nombreCategoria: string) {
    this.router.navigate(['/productos-clientes'], {
      queryParams: { categoria: nombreCategoria }
    });
  }
}

function AutoplayPlugin(slider: KeenSliderInstance) {
  let timeout: any;
  let mouseOver = false;

  function clearNextTimeout() {
    clearTimeout(timeout);
  }

  function nextTimeout() {
    clearTimeout(timeout);
    if (mouseOver) return;
    timeout = setTimeout(() => slider.next(), 3000);
  }

  slider.on("created", () => {
    slider.container.addEventListener("mouseover", () => {
      mouseOver = true;
      clearNextTimeout();
    });
    slider.container.addEventListener("mouseout", () => {
      mouseOver = false;
      nextTimeout();
    });
    nextTimeout();
  });
  slider.on("dragStarted", clearNextTimeout);
  slider.on("animationEnded", nextTimeout);
  slider.on("updated", nextTimeout);
}


