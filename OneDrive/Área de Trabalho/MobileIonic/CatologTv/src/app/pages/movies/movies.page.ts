import { Component, HostBinding, HostListener, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, LoadingController } from '@ionic/angular';
import { MovieService } from 'src/app/services/movie.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
})
export class MoviesPage implements OnInit {
  movies: any[] = [];
  currentPage = 1;
  imageBaseUrl = environment.images;
  isDarkMode = false; // Estado inicial do tema

  @HostBinding('class.dark') isDarkModeClass = false; // Vincula a classe "dark" ao componente

  constructor(private movieService: MovieService, private loadingCtrl: LoadingController) {}

  ngOnInit() {
    this.loadMovies();

    // Define o tema inicial com base no body
    this.isDarkMode = document.body.classList.contains('dark');
  }

  // Função para carregar os filmes
  async loadMovies(event?: InfiniteScrollCustomEvent) {
    const loading = await this.loadingCtrl.create({
      message: 'Carregando...',
      spinner: 'bubbles',
    });
    await loading.present();

    this.movieService.getTopRatedMovies(this.currentPage).subscribe((res) => {
      loading.dismiss();
      this.movies.push(...res.results);

      event?.target.complete();
      if (event) {
        event.target.disabled = res.total_pages === this.currentPage;
      }
    });
  }

  // Função para carregar mais filmes
  loadMore(event: InfiniteScrollCustomEvent) {
    this.currentPage++;
    this.loadMovies(event);
  }

  // Função para alternar o tema
  @HostListener('click', ['$event.target'])
  toggleTheme() {
    const body = document.body; // Referência ao elemento <body>
    this.isDarkMode = !this.isDarkMode; // Alterna o estado do tema

    if (this.isDarkMode) {
      body.classList.add('dark'); // Adiciona a classe 'dark' para tema escuro
    } else {
      body.classList.remove('dark'); // Remove a classe 'dark' para tema claro
    }
  }
}
