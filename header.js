<script>
fetch("header.html")
  .then(res => res.text())
  .then(html => {
    document.body.insertAdjacentHTML("afterbegin", html);

    // active link auto
    const page = document.body.dataset.page;
    document
      .querySelectorAll("header.nav nav a")
      .forEach(link => {
        if (link.dataset.page === page) {
          link.classList.add("active");
        }
      });

    // shadow on scroll (MEDIA behavior)
    const header = document.querySelector("header.nav");
    window.addEventListener("scroll", () => {
      header.style.boxShadow =
        window.scrollY > 12
          ? "0 10px 30px rgba(2,6,23,0.6)"
          : "none";
    });
  });
</script>
