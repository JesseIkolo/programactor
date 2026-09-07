'use client';

import React, { useState, useEffect } from 'react';
import {
  Add01Icon,
  Delete02Icon,
  Edit01Icon,
  Globe02Icon,
  Image01Icon,
  Tick01Icon,
  Cancel01Icon,
  Search01Icon,
  RefreshIcon,
  Upload01Icon,
  StarIcon,
} from 'hugeicons-react';

export interface ProjectItem {
  _id: string;
  slug: string;
  name: string;
  client?: string;
  sector: string;
  city: string;
  year: string;
  duration?: string;
  status: 'PUBLISHED' | 'DRAFT';
  featured?: boolean;
  displayOrder: number;
  coverImageUrl?: string;
  tags: string[];
  contentFr: {
    tagline: string;
    challenge: string;
    solution: string;
    impact?: string;
  };
  contentEn: {
    tagline: string;
    challenge: string;
    solution: string;
    impact?: string;
  };
}

interface AdminProjectsTabProps {
  token: string | null;
  showToast: (msg: string, type?: 'success' | 'error') => void;
  isEn?: boolean;
}

export default function AdminProjectsTab({ token, showToast, isEn = false }: AdminProjectsTabProps) {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  // Formulaire d'édition / création
  const [formLang, setFormLang] = useState<'fr' | 'en'>('fr');
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [sector, setSector] = useState('');
  const [city, setCity] = useState('');
  const [year, setYear] = useState('2026');
  const [duration, setDuration] = useState('3 semaines');
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED');
  const [featured, setFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');

  // Contenus bilingues
  const [taglineFr, setTaglineFr] = useState('');
  const [challengeFr, setChallengeFr] = useState('');
  const [solutionFr, setSolutionFr] = useState('');
  const [impactFr, setImpactFr] = useState('');

  const [taglineEn, setTaglineEn] = useState('');
  const [challengeEn, setChallengeEn] = useState('');
  const [solutionEn, setSolutionEn] = useState('');
  const [impactEn, setImpactEn] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/projects?status=ALL');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setProjects(data.data);
      }
    } catch (err) {
      console.error('Erreur chargement projets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setName('');
    setClient('');
    setSector('');
    setCity('Douala');
    setYear(new Date().getFullYear().toString());
    setDuration('3 semaines');
    setStatus('PUBLISHED');
    setFeatured(false);
    setDisplayOrder(projects.length + 1);
    setCoverImageUrl('');
    setTags(['Web', 'Mobile']);
    setTaglineFr('');
    setChallengeFr('');
    setSolutionFr('');
    setImpactFr('');
    setTaglineEn('');
    setChallengeEn('');
    setSolutionEn('');
    setImpactEn('');
    setFormLang('fr');
    setIsModalOpen(true);
  };

  const openEditModal = (p: ProjectItem) => {
    setEditingProject(p);
    setName(p.name);
    setClient(p.client || '');
    setSector(p.sector);
    setCity(p.city);
    setYear(p.year || '2026');
    setDuration(p.duration || '3 semaines');
    setStatus(p.status || 'PUBLISHED');
    setFeatured(Boolean(p.featured));
    setDisplayOrder(p.displayOrder || 1);
    setCoverImageUrl(p.coverImageUrl || '');
    setTags(p.tags || []);
    setTaglineFr(p.contentFr?.tagline || '');
    setChallengeFr(p.contentFr?.challenge || '');
    setSolutionFr(p.contentFr?.solution || '');
    setImpactFr(p.contentFr?.impact || '');
    setTaglineEn(p.contentEn?.tagline || '');
    setChallengeEn(p.contentEn?.challenge || '');
    setSolutionEn(p.contentEn?.solution || '');
    setImpactEn(p.contentEn?.impact || '');
    setFormLang('fr');
    setIsModalOpen(true);
  };

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    if (!tags.includes(newTagInput.trim())) {
      setTags([...tags, newTagInput.trim()]);
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((item) => item !== t));
  };

  // Upload d'image direct
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setCoverImageUrl(data.url);
        showToast(isEn ? 'Image uploaded.' : 'Image uploadée avec succès.', 'success');
      } else {
        throw new Error(data.message || 'Erreur lors de l’upload');
      }
    } catch (err: any) {
      showToast(err.message || 'Impossible d’uploader l’image.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sector.trim()) {
      showToast(isEn ? 'Title and sector are required.' : 'Le titre et le secteur sont obligatoires.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name,
        client,
        sector,
        city,
        year,
        duration,
        status,
        featured,
        displayOrder: Number(displayOrder) || 1,
        coverImageUrl,
        tags,
        contentFr: {
          tagline: taglineFr,
          challenge: challengeFr,
          solution: solutionFr,
          impact: impactFr,
        },
        contentEn: {
          tagline: taglineEn,
          challenge: challengeEn,
          solution: solutionEn,
          impact: impactEn,
        },
      };

      const isEdit = Boolean(editingProject);
      const url = isEdit ? `/api/projects/${editingProject!._id}` : '/api/projects';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast(
          isEdit
            ? (isEn ? 'Project updated.' : 'Projet mis à jour avec succès.')
            : (isEn ? 'Project created.' : 'Nouveau projet ajouté avec succès.'),
          'success'
        );
        setIsModalOpen(false);
        fetchProjects();
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la sauvegarde.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (!window.confirm(isEn ? `Delete project "${name}"?` : `Supprimer définitivement "${name}" ?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const data = await res.json();
      if (data.success) {
        showToast(isEn ? 'Project deleted.' : 'Projet supprimé.', 'success');
        setProjects((prev) => prev.filter((p) => p._id !== id));
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      showToast(err.message || 'Impossible de supprimer.', 'error');
    }
  };

  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      !searchQuery ||
      p.name.toLowerCase().includes(q) ||
      p.sector.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="space-y-6">
      {/* Barre d'action supérieure */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>{isEn ? 'Case Studies CMS' : 'CMS Réalisations & Projets'}</span>
            <span className="text-xs font-mono text-[#EBFF72] bg-[#EBFF72]/10 px-2.5 py-0.5 rounded-full">
              {projects.length} {isEn ? 'projects' : 'études de cas'}
            </span>
          </h3>
          <p className="text-xs text-white/60">
            {isEn
              ? 'Manage public showcase projects, upload screenshots, create dynamic tags, and reorder items.'
              : 'Gérez les réalisations affichées sur l’accueil et la galerie avec saisie bilingue, tags et réordonnancement.'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={openCreateModal}
            className="flex-1 sm:flex-none py-2.5 px-4 bg-[#EBFF72] hover:bg-[#d9ec61] text-[#0E0E0E] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#EBFF72]/10"
          >
            <Add01Icon size={16} />
            <span>{isEn ? 'New Case Study' : 'Nouvelle Réalisation'}</span>
          </button>

          <button
            type="button"
            onClick={fetchProjects}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white transition-colors"
            title="Rafraîchir"
          >
            <RefreshIcon size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="relative w-full max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
          <Search01Icon size={15} />
        </div>
        <input
          type="text"
          placeholder={isEn ? 'Search project by name, sector, tag...' : 'Rechercher par titre, secteur, tag...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-[#141414] border border-white/10 rounded-xl text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-[#EBFF72]"
        />
      </div>

      {/* Grille des réalisations */}
      {loading && projects.length === 0 ? (
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-12 text-center text-white/40 font-mono text-xs">
          Chargement des projets...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-12 text-center text-white/40 font-mono text-xs">
          Aucun projet trouvé.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((p) => (
            <div
              key={p._id}
              className="bg-[#141414] border border-white/10 hover:border-white/20 rounded-2xl p-5 space-y-4 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* En-tête de carte avec badges */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        p.status === 'PUBLISHED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      ● {p.status === 'PUBLISHED' ? 'Publié' : 'Brouillon'}
                    </span>

                    {p.featured && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EBFF72]/15 text-[#EBFF72] border border-[#EBFF72]/30 flex items-center gap-1">
                        <StarIcon size={11} />
                        Featured
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-mono text-white/40">Ordre : #{p.displayOrder}</span>
                </div>

                {/* Titre & Accroche */}
                <div>
                  <h4 className="text-base font-bold text-white">{p.name}</h4>
                  <div className="text-xs text-white/60 font-mono mt-0.5">
                    {p.sector} · {p.city} ({p.year})
                  </div>
                </div>

                <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
                  {p.contentFr?.tagline || p.contentEn?.tagline || 'Aucune accroche renseignée.'}
                </p>

                {/* Tags */}
                {p.tags && p.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/50 text-white/60 border border-white/5"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions d'administration */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(p)}
                  className="py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-white flex items-center gap-1.5 transition-colors"
                >
                  <Edit01Icon size={14} />
                  <span>Modifier</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteProject(p._id, p.name)}
                  className="py-1.5 px-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-mono text-red-400 border border-red-500/20 transition-colors"
                  title="Supprimer"
                >
                  <Delete02Icon size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL CRÉATION / MODIFICATION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#141414] border border-white/15 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 text-white space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#EBFF72] block">
                  Éditeur de Réalisation
                </span>
                <h3 className="text-xl font-bold text-white">
                  {editingProject ? `Modifier : ${editingProject.name}` : 'Créer une nouvelle étude de cas'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white"
              >
                <Cancel01Icon size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-6 text-xs">
              {/* Informations Générales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 font-mono mb-1.5">NOM DU PROJET *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: MoMo Pay Terminal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#EBFF72]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-mono mb-1.5">CLIENT / ENTREPRISE</label>
                  <input
                    type="text"
                    placeholder="Ex: Express Logistics SARL"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#EBFF72]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-mono mb-1.5">SECTEUR D'ACTIVITÉ *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Fintech, Santé, Logistique..."
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#EBFF72]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-mono mb-1.5">VILLE / PAYS *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Douala, Libreville..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#EBFF72]"
                  />
                </div>
              </div>

              {/* Upload Image Direct */}
              <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                <label className="block text-white/70 font-mono flex items-center gap-1.5">
                  <Image01Icon size={14} className="text-[#EBFF72]" />
                  <span>IMAGE DE COUVERTURE / CAPTURE D'ÉCRAN</span>
                </label>

                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="w-full sm:w-auto text-xs text-white/60 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-mono file:bg-[#EBFF72] file:text-black hover:file:bg-[#d9ec61] cursor-pointer"
                  />

                  <span className="text-white/30 font-mono text-[11px]">ou URL :</span>

                  <input
                    type="text"
                    placeholder="/projects/example.jpg"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-black/50 border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#EBFF72]"
                  />
                </div>

                {coverImageUrl && (
                  <div className="pt-2">
                    <span className="text-[10px] font-mono text-white/40 block mb-1">Aperçu :</span>
                    <img
                      src={coverImageUrl}
                      alt="Preview"
                      className="w-32 h-20 object-cover rounded-xl border border-white/15"
                    />
                  </div>
                )}
              </div>

              {/* Tags Personnalisés */}
              <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                <label className="block text-white/70 font-mono">TAGS TECHNIQUES & LIVRABLES</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ex: Fintech, Mobile Money, Web, Identité..."
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 bg-black/50 border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#EBFF72]"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-mono text-xs rounded-xl"
                  >
                    Ajouter tag
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-white text-xs font-mono flex items-center gap-1.5"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-white/40 hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Visibilité, Ordre & Statut */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-black/40 border border-white/10 rounded-2xl">
                <div>
                  <label className="block text-white/70 font-mono mb-1.5">ORDRE D'AFFICHAGE</label>
                  <input
                    type="number"
                    min={1}
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#EBFF72]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-mono mb-1.5">STATUT</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#EBFF72]"
                  >
                    <option value="PUBLISHED">Publié (En ligne)</option>
                    <option value="DRAFT">Brouillon (Masqué)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="featured-check"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#EBFF72]"
                  />
                  <label htmlFor="featured-check" className="text-white font-mono text-xs cursor-pointer">
                    Mis en avant accueil
                  </label>
                </div>
              </div>

              {/* Onglets Bilingues pour l'Étude de Cas */}
              <div className="space-y-4 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-white/60">
                    Étude de cas détaillée (Bilingue)
                  </span>
                  <div className="flex rounded-xl bg-black/50 border border-white/10 p-1 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => setFormLang('fr')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        formLang === 'fr' ? 'bg-[#EBFF72] text-black font-bold' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      FRANÇAIS
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormLang('en')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        formLang === 'en' ? 'bg-[#EBFF72] text-black font-bold' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      ENGLISH
                    </button>
                  </div>
                </div>

                {formLang === 'fr' ? (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div>
                      <label className="block text-white/70 font-mono mb-1">ACCROCHE COURTE (FR)</label>
                      <input
                        type="text"
                        placeholder="Ex: Encaissement instantané QR code et USSD pour commerçants de proximité."
                        value={taglineFr}
                        onChange={(e) => setTaglineFr(e.target.value)}
                        className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#EBFF72]"
                      />
                    </div>

                    <div>
                      <label className="block text-white/70 font-mono mb-1">LE PROBLÈME RENCONTRÉ (FR)</label>
                      <textarea
                        rows={2}
                        placeholder="Ex: Réseaux 3G instables dans les marchés, réticence aux interfaces complexes..."
                        value={challengeFr}
                        onChange={(e) => setChallengeFr(e.target.value)}
                        className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#EBFF72]"
                      />
                    </div>

                    <div>
                      <label className="block text-white/70 font-mono mb-1">LA RÉPONSE / SOLUTION (FR)</label>
                      <textarea
                        rows={2}
                        placeholder="Ex: Architecture offline-first, confirmation audio bilingue pidgin/français..."
                        value={solutionFr}
                        onChange={(e) => setSolutionFr(e.target.value)}
                        className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#EBFF72]"
                      />
                    </div>

                    <div>
                      <label className="block text-white/70 font-mono mb-1">RÉSULTATS CHIFFRÉS / IMPACT (FR)</label>
                      <input
                        type="text"
                        placeholder="Ex: -40% temps d'encaissement, 100% offline, validé en 15 jours"
                        value={impactFr}
                        onChange={(e) => setImpactFr(e.target.value)}
                        className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#EBFF72]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div>
                      <label className="block text-white/70 font-mono mb-1">SHORT TAGLINE (EN)</label>
                      <input
                        type="text"
                        placeholder="Ex: Instant QR code and USSD merchant terminal designed for local markets."
                        value={taglineEn}
                        onChange={(e) => setTaglineEn(e.target.value)}
                        className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#EBFF72]"
                      />
                    </div>

                    <div>
                      <label className="block text-white/70 font-mono mb-1">THE CHALLENGE (EN)</label>
                      <textarea
                        rows={2}
                        placeholder="Ex: Unstable 3G connectivity in local markets, merchant resistance to complex menus..."
                        value={challengeEn}
                        onChange={(e) => setChallengeEn(e.target.value)}
                        className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#EBFF72]"
                      />
                    </div>

                    <div>
                      <label className="block text-white/70 font-mono mb-1">THE PRODUCT SOLUTION (EN)</label>
                      <textarea
                        rows={2}
                        placeholder="Ex: Offline-first architecture with auto-sync and bilingual audio confirmations..."
                        value={solutionEn}
                        onChange={(e) => setSolutionEn(e.target.value)}
                        className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#EBFF72]"
                      />
                    </div>

                    <div>
                      <label className="block text-white/70 font-mono mb-1">MEASURED IMPACT / RESULTS (EN)</label>
                      <input
                        type="text"
                        placeholder="Ex: -40% checkout time, 100% offline uptime, tested in 15 days"
                        value={impactEn}
                        onChange={(e) => setImpactEn(e.target.value)}
                        className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-[#EBFF72]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Bouton de soumission */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-3 px-4 bg-[#EBFF72] hover:bg-[#d9ec61] text-[#0E0E0E] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#EBFF72]/10 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                      <span>{isEn ? 'Saving...' : 'Enregistrement...'}</span>
                    </>
                  ) : (
                    <>
                      <Tick01Icon size={16} />
                      <span>{isEn ? 'Save Project' : 'Enregistrer la réalisation'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-3 px-5 bg-white/10 hover:bg-white/15 text-white font-mono text-xs rounded-xl"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
