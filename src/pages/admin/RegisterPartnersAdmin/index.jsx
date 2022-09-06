import { AdminTemplate } from "../../../components/templates/AdminTemplate";
import { useState } from "react";
import api from '../../../services/api';
import "./style.css"
import "./responsive.css"
import { SuccessRegister } from "../../../components/SuccessRegister";

export function RegisterPartnersAdmin() {

  const [loading, setLoading] = useState('')
  const [successMessage, setSuccessMessage] = useState(false)
  const [urlWarning, setUrlWarning] = useState('');
  const [form, setForm] = useState(
    {
      slug: "",
      urlToImage: "",
      title: "",
      subtitle: "",
      description: "",
      urlContact: ""
    }
  )

  function handleChange(e) {
    if (e.target.value.length > 0 && e.target.value !== '') {
      setForm({
        ...form,
        "slug": form.title.toLowerCase().replace(/ /g, "-"),
        [e.target.name]: e.target.value,
      });
    } else {
      setForm({
        ...form,
        [e.target.name]: '',
      });
    }

    if ((e.target.name === 'urlToImage' || e.target.name === 'urlContact') && !e.target.value.includes('https://')) {
      setUrlWarning('As urls precisam incluir "https://"')
    } else {
      setUrlWarning('');
    }

    if (e.target.value === ' ') {
      setForm({
        ...form,
        [e.target.name]: '',
      });
    }

  }

  const validationForm = (data) => {
    for (const key in form) {
      if (['', 0, null].includes(data[key])) {
        return false;
      }
    }
    return true;
  }

  const validateURL = () => {
    if ((form.urlToImage).includes('https://') && (form.urlContact).includes('https://')) {
      return true
    };
    return false;
  }



  async function handleSubmit(e) {
    e.preventDefault();
    if (validationForm(form) && validateURL()) {
      await postPartners()
      for (const key in form) {
        form[key] = '';
      }
    } else if (!validationForm(form)) {
      setUrlWarning('Preencha todos os campos!');
    } else if (!validateURL()) {
      setUrlWarning('As urls precisam incluir "https://"')
    }
  }

  async function postPartners() {
    setLoading(true)
    try {
      await api.post('/partners', form)
      setSuccessMessage(true)
    }
    catch (err) {
      console.error(err);
    }
    finally {
      setLoading(false)
      setTimeout(() => {
        setSuccessMessage(false);
      }, 4000);
    }
  }

  return (
    <AdminTemplate colorPartners='--tertiary'>
      <main className="main_RegisterPartners">
        <div className="content_RegisterPartners">
          <h1 className="h1_RegisterPartners">Cadastrar novo parceiro</h1>
          <form
            onSubmit={handleSubmit}
            className="form_RegisterPartners"
          >
            <input
              className="input_RegisterPartners"
              type="text"
              name="urlToImage"
              placeholder="URL da imagem"
              value={form.urlToImage}
              onChange={handleChange}
              required
            />
            <input
              className="input_RegisterPartners"
              type="text"
              name="title"
              placeholder="Nome"
              value={form.title}
              onChange={handleChange}
              required
            />
            <input
              className="input_RegisterPartners"
              type="text"
              name="subtitle"
              placeholder="Cidade"
              value={form.subtitle}
              onChange={handleChange}
              required
            />
            <input
              className="input_RegisterPartners"
              type="text"
              name="description"
              placeholder="Endereço"
              value={form.description}
              onChange={handleChange}
              required
            />
            <input
              className="input_RegisterPartners"
              type="text"
              name="urlContact"
              placeholder="URL de contato"
              value={form.urlContact}
              onChange={handleChange}
              required
            />
            <p className="url-warning_RegisterPartners">{urlWarning}</p>
            <button className="btn_RegisterPartners" type="submit">
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
            {
              successMessage &&
              <SuccessRegister
                title='Parceiro cadastrado com sucesso!'
              />
            }
          </form>
        </div>
      </main>
    </AdminTemplate>
  )
}