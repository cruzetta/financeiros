import { useState, useEffect } from 'react'
import { supabase, UserData } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useUserData(dataType: string = 'general') {
  const { user } = useAuth()
  const [data, setData] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadUserData()
    } else {
      setData({})
      setLoading(false)
    }
  }, [user, dataType])

  const loadUserData = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data: userData, error } = await supabase
        .from('user_data')
        .select('*')
        .eq('user_id', user.id)
        .eq('data_type', dataType)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      setData(userData?.data || {})
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const saveUserData = async (newData: any) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('user_data')
        .upsert([
          {
            user_id: user.id,
            data_type: dataType,
            data: newData,
          },
        ], {
          onConflict: 'user_id,data_type'
        })

      if (error) throw error

      setData(newData)
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  return {
    data,
    loading,
    error,
    saveUserData,
    refreshData: loadUserData,
  }
}