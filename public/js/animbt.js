// animbt.js

// Экспортируем функцию анимации для кнопки "animated-button"
export function animateButton() {
  document.querySelector('.animated-button').addEventListener('click', function() {
      const button = this;
      const dustContainer = document.querySelector('.dust-container-like');
      const buttonRect = button.getBoundingClientRect();

      for (let i = 0; i < 30; i++) {
          const particle = document.createElement('span');
          particle.classList.add('particle-like');
          dustContainer.appendChild(particle);

          const angle = Math.random() * 2 * Math.PI;
          const distance = 30 + Math.random() * 120;
          const translateX = Math.cos(angle) * distance; 
          const translateY = Math.sin(angle) * distance; 
          particle.style.setProperty('--translateX', `${translateX}px`);
          particle.style.setProperty('--translateY', `${translateY}px`);

          const startX = buttonRect.left + buttonRect.width / 2;
          const startY = buttonRect.top + buttonRect.height / 2;

          particle.style.left = `${startX}px`;
          particle.style.top = `${startY}px`;

          particle.style.animation = `dustAnimation 1.5s forwards`;
          particle.addEventListener('animationend', () => particle.remove());
      }
  });
}

// Экспортируем функцию анимации для кнопки "reverse-animated-button"
export function animateReverseButton() {
  document.querySelector('.reverse-animated-button').addEventListener('click', function() {
      const button = this;
      const dustContainer = document.querySelector('.dust-container-dsl');
      const buttonRect = button.getBoundingClientRect();

      for (let i = 0; i < 30; i++) {
          const particle = document.createElement('span');
          particle.classList.add('particle-dsl');
          dustContainer.appendChild(particle);

          const angle = Math.random() * 2 * Math.PI;
          const distance = 60 + Math.random() * 60;
          const translateX = Math.cos(angle) * distance; 
          const translateY = Math.sin(angle) * distance; 

          const startX = buttonRect.left + buttonRect.width / 2;
          const startY = buttonRect.top + buttonRect.height / 2;

          particle.style.left = `${startX}px`;
          particle.style.top = `${startY}px`;

          particle.style.setProperty('--translateX', `${translateX}px`);
          particle.style.setProperty('--translateY', `${translateY}px`);

          particle.style.animation = `dustAnimationInward 1.5s forwards`;
          particle.addEventListener('animationend', () => particle.remove());
      }
  });
}