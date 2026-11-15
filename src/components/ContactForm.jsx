import React, { useState, useEffect } from 'react';
import { UserPlus, Save, X, AlertCircle, User, Mail, Phone, Image as ImageIcon } from 'lucide-react';

function ContactForm({ onSaveContact, editingContact, onCancelEdit }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedImage, setUploadedImage] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [error, setError] = useState('');

  // Pré-remplir le formulaire lorsqu'un contact est sélectionné pour modification
  useEffect(() => {
    if (editingContact) {
      setFullName(editingContact.fullName || '');
      setEmail(editingContact.email || '');
      setPhoneNumber(editingContact.phoneNumber || '');
      const contactImage = editingContact.image || '';
      setImageUrl(contactImage.startsWith('data:image/') ? '' : contactImage);
      setUploadedImage(contactImage.startsWith('data:image/') ? contactImage : '');
      setError('');
    } else {
      setFullName('');
      setEmail('');
      setPhoneNumber('');
      setImageUrl('');
      setUploadedImage('');
      setError('');
    }
    setIsProcessingImage(false);
  }, [editingContact]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner un fichier image.');
      return;
    }

    setError('');
    setIsProcessingImage(true);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        setError('Impossible de lire cette image.');
        setIsProcessingImage(false);
        return;
      }

      const imageElement = new window.Image();
      imageElement.onload = () => {
        const maxDimension = 1200;
        const scale = Math.min(
          1,
          maxDimension / Math.max(imageElement.width, imageElement.height)
        );
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(imageElement.width * scale);
        canvas.height = Math.round(imageElement.height * scale);
        const context = canvas.getContext('2d');

        if (!context) {
          setError('Impossible de traiter cette image.');
          setIsProcessingImage(false);
          return;
        }

        try {
          context.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
          setUploadedImage(canvas.toDataURL('image/jpeg', 0.82));
          setImageUrl('');
        } catch (imageError) {
          console.error('Erreur lors du traitement de la photo :', imageError);
          setError('Impossible de traiter cette image.');
        } finally {
          setIsProcessingImage(false);
        }
      };
      imageElement.onerror = () => {
        setError('Impossible de lire cette image.');
        setIsProcessingImage(false);
      };
      imageElement.src = reader.result;
    };
    reader.onerror = () => {
      setError('Impossible de lire cette image.');
      setIsProcessingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isProcessingImage) {
      setError('Veuillez attendre le chargement de la photo.');
      return;
    }

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    // Validation obligatoire : nom complet et adresse e-mail non vides
    if (!trimmedName || !trimmedEmail) {
      setError('Le nom complet et l’adresse e-mail sont obligatoires.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Veuillez saisir une adresse e-mail valide.');
      return;
    }

    // URL d'avatar générée automatiquement si le champ image est laissé vide
    const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      trimmedName
    )}&background=4f46e5&color=fff&bold=true&size=128`;

    const contactPayload = {
      id: editingContact ? editingContact.id : Date.now(),
      fullName: trimmedName,
      email: trimmedEmail,
      phoneNumber: phoneNumber.trim() || 'Non renseigné',
      image: imageUrl.trim() || uploadedImage || fallbackAvatar,
    };

    onSaveContact(contactPayload);

    // Réinitialiser les champs après ajout
    if (!editingContact) {
      setFullName('');
      setEmail('');
      setPhoneNumber('');
      setImageUrl('');
      setUploadedImage('');
    }
    setError('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden sticky top-6">
      <div
        className={`px-6 py-4 border-b flex items-center justify-between ${
          editingContact
            ? 'bg-amber-50/80 border-amber-200/70'
            : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-transparent'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {editingContact ? (
            <Save className="w-5 h-5 text-amber-600" />
          ) : (
            <UserPlus className="w-5 h-5 text-white" />
          )}
          <h2
            className={`font-semibold text-base ${
              editingContact ? 'text-amber-900' : 'text-white'
            }`}
          >
            {editingContact ? 'Modifier le contact' : 'Nouveau contact'}
          </h2>
        </div>

        {editingContact && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs font-medium text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200/70 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
          >
            <X className="w-3.5 h-3.5" />
            Annuler
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Nom complet <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ex: Aya Koné"
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Adresse e-mail <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: aya.kone@exemple.ci"
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Numéro de téléphone
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Ex: +225 07 08 09 10 11"
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Photo
          </label>
          <label className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl text-sm font-medium hover:bg-indigo-100 transition cursor-pointer">
            <ImageIcon className="w-4 h-4" />
            {isProcessingImage ? 'Chargement de la photo...' : 'Choisir une photo du téléphone'}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isProcessingImage}
              className="sr-only"
            />
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setUploadedImage('');
            }}
            aria-label="URL de la photo"
            placeholder="Ou coller l’URL d’une photo"
            className="w-full mt-2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
          />
          {(uploadedImage || imageUrl) && (
            <img
              src={uploadedImage || imageUrl}
              alt="Aperçu de la photo du contact"
              className="mt-3 w-16 h-16 rounded-xl object-cover border border-slate-200"
            />
          )}
        </div>

        <button
          type="submit"
          className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white shadow-sm flex items-center justify-center gap-2 transition cursor-pointer ${
            editingContact
              ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-200'
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
          }`}
        >
          {editingContact ? (
            <>
              <Save className="w-4 h-4" />
              Enregistrer les modifications
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Ajouter le contact
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default ContactForm;
