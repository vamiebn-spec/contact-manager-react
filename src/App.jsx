import React, { useState, useEffect } from 'react';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import SearchBar from './components/SearchBar';
import { BookUser } from 'lucide-react';

const STORAGE_KEY = 'react_contacts_app_v1';

const INITIAL_CONTACTS = [
  {
    id: 1700000000001,
    fullName: 'Aya Koné',
    email: 'aya.kone@techabidjan.ci',
    phoneNumber: '+225 07 48 12 34 56',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 1700000000002,
    fullName: 'Kouassi Yao',
    email: 'k.yao@studio-design.ci',
    phoneNumber: '+225 05 64 90 11 22',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 1700000000003,
    fullName: 'Fatou Diallo',
    email: 'fatou.diallo@consulting.org',
    phoneNumber: '+225 01 42 77 88 99',
    image: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=256&q=80',
  },
];

function App() {
  // Chargement initial depuis localStorage via useState paresseux + synchronisation useEffect
  const [contacts, setContacts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' (A-Z) ou 'desc' (Z-A)
  const [editingContact, setEditingContact] = useState(null);

  // 1. Charger les contacts depuis localStorage au premier démarrage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setContacts(parsed);
        } else {
          setContacts(INITIAL_CONTACTS);
        }
      } else {
        setContacts(INITIAL_CONTACTS);
      }
    } catch (err) {
      console.error('Erreur lors de la lecture du stockage local :', err);
      setContacts(INITIAL_CONTACTS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. Sauvegarder les contacts dans localStorage à chaque modification
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    } catch (err) {
      console.error('Erreur lors de la sauvegarde dans le stockage local :', err);
    }
  }, [contacts, isLoaded]);

  // Ajouter ou mettre à jour un contact
  const handleSaveContact = (contactData) => {
    if (editingContact) {
      setContacts((prev) =>
        prev.map((item) => (item.id === contactData.id ? contactData : item))
      );
      setEditingContact(null);
    } else {
      setContacts((prev) => [contactData, ...prev]);
    }
  };

  // Supprimer un contact par son identifiant unique
  const handleDeleteContact = (id) => {
    setContacts((prev) => prev.filter((item) => item.id !== id));
    if (editingContact && editingContact.id === id) {
      setEditingContact(null);
    }
  };

  // Filtrage par nom complet + tri alphabétique A-Z / Z-A
  const filteredAndSortedContacts = contacts
    .filter((contact) =>
      contact.fullName.toLowerCase().includes(searchQuery.trim().toLowerCase())
    )
    .sort((a, b) => {
      const comparison = a.fullName.localeCompare(b.fullName, 'fr', {
        sensitivity: 'base',
      });
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* En-tête */}
      <header className="bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shadow-indigo-200">
              <BookUser className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Carnet de Contacts
              </h1>
              <p className="text-xs text-slate-500">
                Gérez vos contacts personnels et professionnels en toute simplicité
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Colonne Formulaire (Ajout / Modification) */}
          <aside className="lg:col-span-4">
            <ContactForm
              onSaveContact={handleSaveContact}
              editingContact={editingContact}
              onCancelEdit={() => setEditingContact(null)}
            />
          </aside>

          {/* Colonne Recherche, Tri & Liste */}
          <section className="lg:col-span-8 space-y-5">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
              totalCount={filteredAndSortedContacts.length}
            />

            <ContactList
              contacts={filteredAndSortedContacts}
              onEdit={(contact) => setEditingContact(contact)}
              onDelete={handleDeleteContact}
              editingContactId={editingContact?.id ?? null}
              searchQuery={searchQuery}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
