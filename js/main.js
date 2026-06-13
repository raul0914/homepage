document.addEventListener('DOMContentLoaded', function() {
  // Mobile navigation toggle
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('active');
      nav.classList.toggle('active');
    });
    document.querySelectorAll('.nav-list a').forEach(function(link) {
      link.addEventListener('click', function() {
        navToggle.classList.remove('active');
        nav.classList.remove('active');
      });
    });
  }

  // Active navigation highlight
  var currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-list a').forEach(function(link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Contact form validation
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      var valid = true;
      var requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach(function(field) {
        var group = field.closest('.form-group');
        if (!group) return;
        if (!field.value.trim()) {
          group.classList.add('error');
          valid = false;
        } else {
          group.classList.remove('error');
        }
        if (field.type === 'email' && field.value.trim()) {
          var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(field.value.trim())) {
            group.classList.add('error');
            valid = false;
          }
        }
      });

      var consent = form.querySelector('#consent');
      if (consent && !consent.checked) {
        consent.closest('.form-consent').style.color = '#c0392b';
        valid = false;
      } else if (consent) {
        consent.closest('.form-consent').style.color = '';
      }

      if (!valid) {
        e.preventDefault();
        var firstError = form.querySelector('.form-group.error');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    form.querySelectorAll('[required]').forEach(function(field) {
      field.addEventListener('input', function() {
        var group = field.closest('.form-group');
        if (group) group.classList.remove('error');
      });
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
