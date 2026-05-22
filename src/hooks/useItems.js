import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';
import { SEED_ITEMS } from '../data/initialData.js';

function fromDB(row) {
  return {
    id:            row.id,
    name:          row.name,
    category:      row.category ?? '',
    brand:         row.brand ?? '',
    image:         row.image ?? null,
    purchaseDate:  row.purchase_date,
    purchasePrice: Number(row.purchase_price),
    listedDate:    row.listed_date,
    listedPrice:   Number(row.listed_price),
    sold:          row.sold,
    soldDate:      row.sold_date ?? null,
    salePrice:     row.sale_price !== null ? Number(row.sale_price) : null,
  };
}

function toDB(item, userId) {
  const payload = {
    name:           item.name,
    category:       item.category ?? '',
    brand:          item.brand ?? '',
    image:          item.image ?? null,
    purchase_date:  item.purchaseDate,
    purchase_price: item.purchasePrice,
    listed_date:    item.listedDate,
    listed_price:   item.listedPrice,
    sold:           item.sold ?? false,
    sold_date:      item.soldDate ?? null,
    sale_price:     item.salePrice ?? null,
  };
  if (userId) payload.user_id = userId;
  return payload;
}

export function useItems(userId) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setItems([]); setLoading(false); return; }

    let cancelled = false;

    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (cancelled) return;
      if (error) { console.error(error); setLoading(false); return; }

      if (data.length === 0) {
        const today = new Date().toISOString().slice(0, 10);
        const seeds = SEED_ITEMS.map((s) =>
          toDB({ ...s, purchaseDate: s.purchaseDate || today, listedDate: s.listedDate || today }, userId)
        );
        const { data: seeded, error: seedErr } = await supabase
          .from('items').insert(seeds).select();
        if (!cancelled && !seedErr && seeded) setItems(seeded.map(fromDB));
      } else {
        setItems(data.map(fromDB));
      }
      if (!cancelled) setLoading(false);
    }

    load();

    const channel = supabase
      .channel(`items:${userId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'items',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setItems((prev) => {
            if (prev.some((it) => it.id === payload.new.id)) return prev;
            return [fromDB(payload.new), ...prev];
          });
        } else if (payload.eventType === 'UPDATE') {
          setItems((prev) => prev.map((it) => it.id === payload.new.id ? fromDB(payload.new) : it));
        } else if (payload.eventType === 'DELETE') {
          setItems((prev) => prev.filter((it) => it.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const addItem = useCallback(async (item) => {
    const { data, error } = await supabase
      .from('items').insert([toDB(item, userId)]).select().single();
    if (!error && data) setItems((prev) => [fromDB(data), ...prev]);
  }, [userId]);

  const importItems = useCallback(async (newItems) => {
    const { data, error } = await supabase
      .from('items').insert(newItems.map((it) => toDB(it, userId))).select();
    if (!error && data) setItems((prev) => [...data.map(fromDB), ...prev]);
  }, [userId]);

  const updateItem = useCallback(async (updatedItem) => {
    const { data, error } = await supabase
      .from('items').update(toDB(updatedItem))
      .eq('id', updatedItem.id).eq('user_id', userId)
      .select().single();
    if (!error && data) setItems((prev) => prev.map((it) => it.id === data.id ? fromDB(data) : it));
  }, [userId]);

  const deleteItem = useCallback(async (id) => {
    await supabase.from('items').delete().eq('id', id).eq('user_id', userId);
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, [userId]);

  const toggleSold = useCallback(async (id, v) => {
    const today = new Date().toISOString().slice(0, 10);
    const item = items.find((it) => it.id === id);
    if (!item) return;
    const { data, error } = await supabase
      .from('items')
      .update({
        sold:       v,
        sold_date:  v ? (item.soldDate || today) : null,
        sale_price: v ? (item.salePrice ?? item.listedPrice) : null,
      })
      .eq('id', id).eq('user_id', userId)
      .select().single();
    if (!error && data) setItems((prev) => prev.map((it) => it.id === id ? fromDB(data) : it));
  }, [userId, items]);

  const updateSalePrice = useCallback(async (id, price) => {
    const { data, error } = await supabase
      .from('items').update({ sale_price: price })
      .eq('id', id).eq('user_id', userId)
      .select().single();
    if (!error && data) setItems((prev) => prev.map((it) => it.id === id ? fromDB(data) : it));
  }, [userId]);

  const updateImage = useCallback(async (id, image) => {
    const { data, error } = await supabase
      .from('items').update({ image })
      .eq('id', id).eq('user_id', userId)
      .select().single();
    if (!error && data) setItems((prev) => prev.map((it) => it.id === id ? fromDB(data) : it));
  }, [userId]);

  return { items, loading, addItem, importItems, updateItem, deleteItem, toggleSold, updateSalePrice, updateImage };
}
