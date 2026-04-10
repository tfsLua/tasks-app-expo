import React, { useMemo } from 'react';
import { SectionList, StyleSheet, View, Text } from 'react-native';
import TaskItem from './TaskItem';
import { TaskItem as TaskType } from '../utils/handle-api';

interface TaskListProps {
  tasks: TaskType[];
  onUpdate: (task: TaskType) => void;
  onDelete: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdate, onDelete }) => {

  const sections = useMemo(() => {
    const completed = tasks.filter(task => task.completed);
    const pending = tasks.filter(task => !task.completed);

    return [
      {
        title: '✅ Concluídas',
        data: completed,
      },
      {
        title: '🕒 Pendentes',
        data: pending,
      },
    ];
  }, [tasks]);

  return (
    <View style={styles.listContainer}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}

        renderItem={({ item }) => (
          <TaskItem
            task={item}
            updateMode={() => onUpdate(item)}
            deleteTask={() => onDelete(item._id)}
          />
        )}

        renderSectionHeader={({ section }) => (
          <View style={styles.header}>
            <Text style={styles.headerText}>{section.title}</Text>
          </View>
        )}

        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>
            Nenhuma tarefa nesta categoria.
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    marginTop: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  header: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    marginTop: 10,
    borderRadius: 4,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
  },
});

export default TaskList;