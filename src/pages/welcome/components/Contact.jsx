const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Habaryňyz iberildi!");
  };

  return (
    <section className="contact" style={{ backgroundColor: "linear-gradient(135deg, #0F3254, #1A4D7A)" }}>
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