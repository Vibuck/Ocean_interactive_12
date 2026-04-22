function goNext() {
  const hero = document.querySelector(".hero");
  hero.classList.add("active");

  setTimeout(() => {
    document.querySelector(".next").scrollIntoView({
      behavior: "smooth"
    });
  }, 500);
}