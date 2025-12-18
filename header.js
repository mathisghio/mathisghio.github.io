document.addEventListener("DOMContentLoaded", () => {
  // HTML du header
  const headerHTML = `
    <header class="nav">
      <div class="logo">
      <a href="index.html">
        <img src="images/logo_Mathis_Ghio.png" alt="Mathis Ghio">
      </a>
      </div>

      <nav>
        <a href="index.html" data-page="home">Home</a>
        <a href="about.html" data-page="about">About</a>
        <a href="track_record.html" data-page="track">Track Record</a>
        <a href="partners.html" data-page="partners">Partners</a>
        <a href="media.html" data-page="media">Media</a>
        <a href="powerbooks.html" data-page="powerbooks">Powerbooks</a>
        <a href="contact.html" data-page="contact">Contact</a>
      </nav>
    </header>
  `;

  // Injection du header dans le body
  document.body.insertAdjacentHTML("afterbegin", headerHTML);

  // Activation automatique du lien correspondant à la page
  const page = document.body.dataset.page;
  document.querySelectorAll("header.nav nav a").forEach(link => {
    if (link.dataset.page === page) {
      link.classList.add("active");
    }
  });

  // Ombre du header au scroll
  const header = document.querySelector("header.nav");
  window.addEventListener("scroll", () => {
    header.style.boxShadow =
      window.scrollY > 12
        ? "0 10px 30px rgba(2,6,23,0.6)"
        : "none";
  });
});
