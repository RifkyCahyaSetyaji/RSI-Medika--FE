import { useState, useEffect, useCallback, useMemo } from 'react';
import { Patient, PatientCreate } from '../types';
import { fetchPatients, createPatient as apiCreatePatient } from '../api';

export function usePatients(initialQuery: string = '') {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPatients();
      setPatients(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data pasien');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  const addPatient = useCallback(async (patientData: PatientCreate): Promise<Patient> => {
    const newPatient = await apiCreatePatient(patientData);
    setPatients((prev) => [newPatient, ...prev]);
    return newPatient;
  }, []);

  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return patients;
    const q = searchQuery.toLowerCase().trim();
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.medical_record_no.toLowerCase().includes(q)
    );
  }, [patients, searchQuery]);

  return {
    patients,
    filteredPatients,
    searchQuery,
    setSearchQuery,
    loading,
    error,
    refreshPatients: loadPatients,
    addPatient,
  };
}
