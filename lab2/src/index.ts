import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.scss';
import { renderApp } from './ui/render';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app');
  if (!root) {
    throw new Error('Не знайдено кореневий контейнер #app у index.html');
  }
  renderApp(root);
});
