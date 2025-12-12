import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useBedrijven() {
  const [bedrijven, setBedrijven] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch all bedrijven
  const fetchBedrijven = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('leveranciers')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching bedrijven:', error)
    } else {
      setBedrijven(data || [])
    }
    
    setLoading(false)
  }

  useEffect(() => {
    fetchBedrijven()

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('leveranciers_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'leveranciers' },
        (payload) => {
          console.log('Change received!', payload)
          fetchBedrijven() // Refresh data
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Create
  const addBedrijf = async (bedrijf) => {
    const { data, error } = await supabase
      .from('leveranciers')
      .insert([bedrijf])
      .select()
    
    if (error) {
      console.error('Error adding bedrijf:', error)
      return { error }
    }
    
    return { data: data[0] }
  }

  // Update
  const updateBedrijf = async (id, updates) => {
    const { data, error } = await supabase
      .from('leveranciers')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
    
    if (error) {
      console.error('Error updating bedrijf:', error)
      return { error }
    }
    
    return { data: data[0] }
  }

  // Delete
  const deleteBedrijf = async (id) => {
    const { error } = await supabase
      .from('leveranciers')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting bedrijf:', error)
      return { error }
    }
    
    return { success: true }
  }

  return { 
    bedrijven, 
    loading, 
    addBedrijf, 
    updateBedrijf, 
    deleteBedrijf,
    refetch: fetchBedrijven 
  }
}
