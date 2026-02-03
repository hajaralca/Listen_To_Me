import { supabase } from '../../lib/supabase';

export default function HomeScreen() {
  const [arabicBooks, setArabicBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const { data } = await supabase
        .from('books')
        .select('*')
        .eq('language', 'ar')
        .eq('is_public_domain', true);
      setArabicBooks(data);
    };
    fetchBooks();
  }, []);

  return (
    <FlatList
      data={arabicBooks}
      renderItem={({ item }) => <BookCard book={item} />}
    />
  );
}