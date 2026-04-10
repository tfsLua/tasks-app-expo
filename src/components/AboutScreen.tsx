import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';

interface Props {
  onClose: () => void;
}

export default function AboutScreen({ onClose }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <Text style={styles.title}>Gerenciador de Tarefas</Text>

      <Image
        source={require('../../assets/task-app-banner.png')}
        style={styles.image}
      />

      <Text style={styles.paragraph}>
        Este aplicativo foi desenvolvido com o objetivo de auxiliar usuários na organização de suas tarefas diárias de forma simples e eficiente.
      </Text>

      <Text style={styles.paragraph}>
        Com ele, é possível adicionar, editar, excluir e acompanhar o status das tarefas, garantindo maior produtividade no dia a dia.
      </Text>

      <Text style={styles.paragraph}>
        O projeto utiliza tecnologias modernas e boas práticas de desenvolvimento mobile com foco em usabilidade e desempenho.
      </Text>

      <Text style={styles.subtitle}>Tecnologias utilizadas:</Text>

      <Text style={styles.list}>• React Native</Text>
      <Text style={styles.list}>• Expo</Text>
      <Text style={styles.list}>• TypeScript</Text>
      <Text style={styles.list}>• EAS</Text>

      <TouchableOpacity style={styles.button} onPress={onClose}>
        <Text style={styles.buttonText}>Fechar</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  paragraph: {
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  list: {
    fontSize: 14,
    marginTop: 4,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 12,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});