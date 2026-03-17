import { useLocale } from "../../../hooks/useLocale";

const Contact = () => {
  const { t } = useLocale();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(t('welcome.contactAlert', { defaultValue: 'Habaryňyz iberildi!' }));
  };


  return (
    <section className="contact" style={{ backgroundColor: "linear-gradient(135deg, #0F3254, #1A4D7A)" }}>
      <div className="container">
        <h2>{t('welcome.contact')}</h2>

        <form className="contact-form" onSubmit={handleSubmit}>
          <input placeholder={t('register.name', { defaultValue: 'Adyňyz' })} required />
          <input placeholder={t('common.email')} required />
          <input placeholder={t('common.phone')} />
          <input placeholder={t('welcome.subject', { defaultValue: 'Tema' })} required />
          <textarea placeholder={t('welcome.message', { defaultValue: 'Habar' })} required />
          <button className="btn-primary">{t('welcome.send')}</button>
        </form>
      </div>
    </section>

  );
};

export default Contact;