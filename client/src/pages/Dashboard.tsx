import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { LuLoaderCircle, LuPlus, LuX, LuTrash2 } from 'react-icons/lu';
import { FaRegEdit } from 'react-icons/fa';

import { useAuthStore } from '../stores/auth.store';
import {
  createParticipant,
  deleteParticipant,
  getMyParticipants,
  updateParticipant,
  type IParticipant,
  type ParticipantFormData,
} from '../api/participant';
import { getJobTitles, getSports } from '../api/options';
import Select from '../components/ui/Select';

const Dashboard = () => {
  const { school } = useAuthStore();

  const [participants, setParticipants] = useState<IParticipant[]>([]);
  const [sportsList, setSportsList] = useState<{ label: string; value: string }[]>([]);
  const [jobsList, setJobsList] = useState<{ label: string; value: string }[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<ParticipantFormData>({
    fullName: '',
    idNumber: '',
    birthday: '',
    jobTitleId: '',
    sportId: '',
  });

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      const [partsData, sportsData, jobsData] = await Promise.all([
        getMyParticipants(),
        getSports(),
        getJobTitles(),
      ]);

      if (partsData) setParticipants(partsData);

      if (sportsData) {
        setSportsList(sportsData.map((s) => ({ label: s.sportName, value: s._id })));
      }

      if (jobsData) {
        setJobsList(jobsData.map((j) => ({ label: j.titleName, value: j._id })));
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.idNumber ||
      !formData.birthday ||
      !formData.jobTitleId ||
      !formData.sportId
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    if (editingId) {
      const updated = await updateParticipant(editingId, formData);
      if (updated) {
        setParticipants(participants.map((p) => (p._id === editingId ? updated : p)));
        toast.success('Participant updated successfully');
        handleClearForm();
      } else {
        toast.error('Failed to update participant. ID Number might be in use.');
      }
    } else {
      const created = await createParticipant(formData);
      if (created) {
        setParticipants([...participants, created]);
        toast.success('Participant added successfully');
        handleClearForm();
      } else {
        toast.error('Failed to add participant. ID Number might already be registered.');
      }
    }

    setIsSubmitting(false);
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this participant?')) {
      const success = await deleteParticipant(id);
      if (success) {
        setParticipants(participants.filter((p) => p._id !== id));
        toast.success('Participant removed successfully');
      } else {
        toast.error('Failed to remove participant.');
      }
    }
  };

  const handleEdit = (participant: IParticipant) => {
    const formattedDate = new Date(participant.birthday).toISOString().split('T')[0];

    setFormData({
      fullName: participant.fullName,
      idNumber: participant.idNumber,
      birthday: formattedDate,
      jobTitleId: participant.jobTitleId._id,
      sportId: participant.sportId._id,
    });
    setEditingId(participant._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearForm = () => {
    setFormData({
      fullName: '',
      idNumber: '',
      birthday: '',
      jobTitleId: '',
      sportId: '',
    });
    setEditingId(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LuLoaderCircle className="w-8 h-8 animate-spin text-[#0EA5E9]" />
      </div>
    );
  }

  return (
    <div className="max-w-285 mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-[#0A1628] mb-1">Welcome, {school?.schoolName}</h1>
        <h2 className="text-lg text-[#64748B]">Participant Registration Form</h2>
      </div>

      {/* Registration Form */}
      <div className="bg-white rounded-xl shadow-md border border-[#E2E8F0] p-4 sm:p-6 mb-6 sm:mb-8">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-[#0A1628]">
                Full Name <span className="text-[#EF4444]">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter full name"
                className="flex h-11 w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#0A1628] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="idNumber" className="block text-sm font-medium text-[#0A1628]">
                ID Number <span className="text-[#EF4444]">*</span>
              </label>
              <input
                id="idNumber"
                type="text"
                value={formData.idNumber}
                onChange={(e) =>
                  setFormData({ ...formData, idNumber: e.target.value.toUpperCase() })
                }
                placeholder="Enter ID number"
                className="flex h-11 w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#0A1628] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="birthday" className="block text-sm font-medium text-[#0A1628]">
                Birthday <span className="text-[#EF4444]">*</span>
              </label>
              <input
                id="birthday"
                type="date"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                className="block h-11 w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#0A1628] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] [&::-webkit-calendar-picker-indicator]:ml-auto [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="jobTitle" className="block text-sm font-medium text-[#0A1628]">
                Job Title <span className="text-[#EF4444]">*</span>
              </label>
              <Select
                id="jobTitle"
                value={formData.jobTitleId}
                onChange={(val) => setFormData({ ...formData, jobTitleId: val })}
                options={jobsList}
                placeholder="Select job title"
                className="h-11 border-[#E2E8F0] focus:ring-[#0EA5E9]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="sport" className="block text-sm font-medium text-[#0A1628]">
                Sport <span className="text-[#EF4444]">*</span>
              </label>
              <Select
                id="sport"
                value={formData.sportId}
                onChange={(val) => setFormData({ ...formData, sportId: val })}
                options={sportsList}
                placeholder="Select sport"
                className="h-11 border-[#E2E8F0] focus:ring-[#0EA5E9]"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-11 w-full sm:w-auto items-center justify-center rounded-md bg-[#0284C7] px-6 text-sm font-medium text-white shadow-lg transition-all hover:from-[#0284C7] hover:to-[#0369A1] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] disabled:opacity-50 gap-2"
            >
              {isSubmitting ? (
                <LuLoaderCircle className="w-4 h-4 animate-spin" />
              ) : editingId ? (
                <FaRegEdit className="w-4 h-4" />
              ) : (
                <LuPlus className="w-4 h-4" />
              )}
              <span>{editingId ? 'Update Participant' : 'Add Participant'}</span>
            </button>

            {(formData.fullName ||
              formData.idNumber ||
              formData.birthday ||
              formData.jobTitleId ||
              formData.sportId ||
              editingId) && (
              <button
                type="button"
                onClick={handleClearForm}
                className="inline-flex h-11 w-full sm:w-auto items-center justify-center rounded-md border border-[#E2E8F0] bg-white px-6 text-sm font-medium text-[#0A1628] transition-colors hover:bg-[#666666] gap-2"
              >
                <LuX className="w-4 h-4" />
                Clear Form
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-md border border-[#E2E8F0] overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-[#0A1628]">Registered Participants</h3>
            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0284C7] text-white shadow-sm">
              {participants.length}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-white uppercase bg-[#0284C7]">
              <tr>
                <th className="px-6 py-3 font-bold">Full Name</th>
                <th className="px-6 py-3 font-bold">ID Number</th>
                <th className="px-6 py-3 font-bold">Birthday</th>
                <th className="px-6 py-3 font-bold">Job Title</th>
                <th className="px-6 py-3 font-bold">Sport</th>
                <th className="px-6 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {participants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#64748B]">
                    No participants registered yet. Add your first participant above.
                  </td>
                </tr>
              ) : (
                participants.map((participant) => (
                  <tr
                    key={participant._id}
                    className="border-b border-[#E2E8F0] hover:bg-[#F8FAFB] transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-[#0A1628]">{participant.fullName}</td>
                    <td className="px-6 py-4 text-[#64748B]">{participant.idNumber}</td>
                    <td className="px-6 py-4 text-[#64748B]">
                      {new Date(participant.birthday).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-md border border-[#E2E8F0] px-2.5 py-0.5 text-xs font-semibold text-[#0A1628]">
                        {participant.jobTitleId.titleName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-[#7C3AED] px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
                        {participant.sportId.sportName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(participant)}
                          className="p-2 text-[#0EA5E9] hover:bg-[#F0F9FF] hover:text-[#0284C7] rounded-md transition-colors"
                        >
                          <FaRegEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(participant._id)}
                          className="p-2 text-[#EF4444] hover:bg-[#FEF2F2] hover:text-[#DC2626] rounded-md transition-colors"
                        >
                          <LuTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
