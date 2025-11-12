import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Linking } from "react-native";

export default function App() {
  const [query, setQuery] = useState("livros de programação");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchBooks() {
    if (!query) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&langRestrict=pt&maxResults=10`
      );
      const data = await response.json();
      setBooks(data.items || []);
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Busca de Livros (PT-BR)</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite o nome do livro..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={fetchBooks}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const info = item.volumeInfo;
            return (
              <TouchableOpacity
                style={styles.item}
                onPress={() => info.infoLink && Linking.openURL(info.infoLink)}
              >
                {info.imageLinks?.thumbnail && (
                  <Image source={{ uri: info.imageLinks.thumbnail }} style={styles.cover} />
                )}
                <View style={styles.info}>
                  <Text style={styles.bookTitle}>{info.title}</Text>
                  <Text style={styles.bookAuthor}>
                    {info.authors ? info.authors.join(", ") : "Autor desconhecido"}
                  </Text>
                  <Text style={styles.bookYear}>
                    {info.publishedDate ? `Ano: ${info.publishedDate}` : ""}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    borderColor: "#DDD",
    borderWidth: 1,
  },
  item: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    borderColor: "#EEE",
    borderWidth: 1,
  },
  cover: {
    width: 60,
    height: 90,
    borderRadius: 5,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bookAuthor: {
    color: "#666",
  },
  bookYear: {
    color: "#999",
    fontSize: 12,
  },
});
