const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Habaryňyz iberildi!");
  };

  return (
    <section className="contact">
      <div className="container">
        <h2>Habarlaşmak</h2>

        <form className="contact-form" onSubmit={handleSubmit}>
          <input placeholder="Adyňyz" required />
          <input placeholder="Email" required />
          <input placeholder="Telefon belgisi" />
          <input placeholder="Tema" required />
          <textarea placeholder="Habar" required />
          <button className="btn-primary">Ibermek</button>
        </form>
      </div>
    </section>
  );
};

export default Contact;