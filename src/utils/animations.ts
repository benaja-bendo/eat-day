/**
 * Utilitaires d'animations pour l'interface cartoon
 * Fournit des fonctions pour déclencher des animations dynamiques
 */

/**
 * Ajoute une animation de "shake" à un élément
 */
export function shakeElement(element: HTMLElement, duration: number = 500) {
  element.style.animation = `shake 0.5s ease-in-out`;
  setTimeout(() => {
    element.style.animation = '';
  }, duration);
}

/**
 * Ajoute une animation de "bounce" à un élément
 */
export function bounceElement(element: HTMLElement, duration: number = 600) {
  element.style.animation = `bounce 0.6s ease-in-out`;
  setTimeout(() => {
    element.style.animation = '';
  }, duration);
}

/**
 * Ajoute une animation de "pulse" à un élément
 */
export function pulseElement(element: HTMLElement, duration: number = 1000) {
  element.style.animation = `pulse 1s ease-in-out`;
  setTimeout(() => {
    element.style.animation = '';
  }, duration);
}

/**
 * Ajoute une animation de "wiggle" à un élément
 */
export function wiggleElement(element: HTMLElement, duration: number = 800) {
  element.style.animation = `wiggle 0.8s ease-in-out`;
  setTimeout(() => {
    element.style.animation = '';
  }, duration);
}

/**
 * Ajoute une animation de "float" à un élément
 */
export function floatElement(element: HTMLElement, duration: number = 2000) {
  element.style.animation = `float 2s ease-in-out infinite`;
  setTimeout(() => {
    element.style.animation = '';
  }, duration);
}

/**
 * Ajoute une animation de "scale-up" temporaire à un élément
 */
export function scaleUpElement(element: HTMLElement, scale: number = 1.1, duration: number = 200) {
  const originalTransform = element.style.transform;
  element.style.transition = `transform ${duration}ms ease-out`;
  element.style.transform = `scale(${scale})`;
  
  setTimeout(() => {
    element.style.transform = originalTransform;
    setTimeout(() => {
      element.style.transition = '';
    }, duration);
  }, duration);
}

/**
 * Ajoute un effet de "glow" temporaire à un élément
 */
export function glowElement(element: HTMLElement, color: string = '#fbbf24', duration: number = 1000) {
  const originalBoxShadow = element.style.boxShadow;
  element.style.transition = `box-shadow ${duration}ms ease-out`;
  element.style.boxShadow = `0 0 20px ${color}, 0 0 40px ${color}`;
  
  setTimeout(() => {
    element.style.boxShadow = originalBoxShadow;
    setTimeout(() => {
      element.style.transition = '';
    }, duration);
  }, duration);
}

/**
 * Crée un effet de particules autour d'un élément
 */
export function createParticleEffect(element: HTMLElement, particleCount: number = 8) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = `${centerX}px`;
    particle.style.top = `${centerY}px`;
    particle.style.width = '8px';
    particle.style.height = '8px';
    particle.style.backgroundColor = '#fbbf24';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    
    const angle = (i / particleCount) * Math.PI * 2;
    const distance = 50 + Math.random() * 30;
    const endX = centerX + Math.cos(angle) * distance;
    const endY = centerY + Math.sin(angle) * distance;
    
    particle.style.transition = 'all 0.8s ease-out';
    document.body.appendChild(particle);
    
    // Déclencher l'animation
    requestAnimationFrame(() => {
      particle.style.left = `${endX}px`;
      particle.style.top = `${endY}px`;
      particle.style.opacity = '0';
      particle.style.transform = 'scale(0)';
    });
    
    // Nettoyer après l'animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 800);
  }
}

/**
 * Ajoute un effet de "confetti" pour les succès
 */
export function createConfettiEffect(element: HTMLElement, confettiCount: number = 15) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = `${centerX + (Math.random() - 0.5) * 20}px`;
    confetti.style.top = `${centerY + (Math.random() - 0.5) * 20}px`;
    confetti.style.width = `${4 + Math.random() * 6}px`;
    confetti.style.height = `${4 + Math.random() * 6}px`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = 100 + Math.random() * 100;
    const endX = centerX + Math.cos(angle) * velocity;
    const endY = centerY + Math.sin(angle) * velocity + 200; // Gravité
    
    confetti.style.transition = 'all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    document.body.appendChild(confetti);
    
    // Déclencher l'animation
    requestAnimationFrame(() => {
      confetti.style.left = `${endX}px`;
      confetti.style.top = `${endY}px`;
      confetti.style.opacity = '0';
      confetti.style.transform = `rotate(${Math.random() * 720}deg)`;
    });
    
    // Nettoyer après l'animation
    setTimeout(() => {
      if (confetti.parentNode) {
        confetti.parentNode.removeChild(confetti);
      }
    }, 1500);
  }
}

/**
 * Hook React pour utiliser les animations facilement
 */
export function useAnimations() {
  const animateOnClick = (callback: () => void, animationType: 'bounce' | 'shake' | 'pulse' | 'wiggle' = 'bounce') => {
    return (event: React.MouseEvent<HTMLElement>) => {
      const element = event.currentTarget;
      
      switch (animationType) {
        case 'bounce':
          bounceElement(element);
          break;
        case 'shake':
          shakeElement(element);
          break;
        case 'pulse':
          pulseElement(element);
          break;
        case 'wiggle':
          wiggleElement(element);
          break;
      }
      
      callback();
    };
  };
  
  const animateOnSuccess = (element: HTMLElement) => {
    createConfettiEffect(element);
    glowElement(element, '#10b981');
  };
  
  const animateOnError = (element: HTMLElement) => {
    shakeElement(element);
    glowElement(element, '#ef4444');
  };
  
  return {
    animateOnClick,
    animateOnSuccess,
    animateOnError,
    createParticleEffect,
    createConfettiEffect,
    scaleUpElement,
    glowElement
  };
}