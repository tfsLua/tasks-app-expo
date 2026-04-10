import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Platform, StatusBar as RNStatusBar, Image, Pressable, ActivityIndicator, Modal, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Checkbox from 'expo-checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import TaskList from './src/components/TaskList';
import AboutScreen from './src/components/AboutScreen';
import { addTask, deleteTask, getAllTasks, updateTask, TaskItem } from './src/utils/handle-api';
import { globalStyles } from './src/styles/global';

export default function App() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [text, setText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [logoError, setLogoError] = useState(false);

  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [priority, setPriority] = useState<'Baixa' | 'Média' | 'Alta'>('Baixa');

  const [aboutVisible, setAboutVisible] = useState(false);

  useEffect(() => {
    getAllTasks(setTasks, setLoading);
  }, []);

  const resetForm = () => {
    setText("");
    setCompleted(false);
    setDueDate(null);
    setIsUpdating(false);
    setTaskId("");
    setModalVisible(false);
  };

  const updateMode = (task: TaskItem) => {
    setIsUpdating(true);
    setTaskId(task._id);
    setText(task.text);
    setCompleted(!!task.completed);
    setDueDate(task.dueDate ? new Date(task.dueDate) : null);
    setModalVisible(true);
  };

  const handleSave = () => {
    const formattedDate = dueDate ? dueDate.toISOString() : null;
    if (isUpdating) {
      updateTask(taskId, text, completed, formattedDate, setTasks, resetForm);
    } else {
      addTask(text, completed, formattedDate, setTasks, resetForm);
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDueDate(selectedDate);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <View style={styles.headerContainer}>
          {!logoError ? (
            <Image 
              source={require('./assets/task-app-banner.png')} 
              style={styles.logo}
              onError={() => setLogoError(true)}
            />
          ) : (
            <Text style={styles.header}>Gerenciador de Tarefas</Text>
          )}
          <Text style={styles.header}>Tarefas</Text>
        </View>

        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>Total de Tarefas: {tasks.length}</Text>
        </View>

        {/* FILTRO */}
        <View style={styles.filterContainer}>
          {['all', 'completed', 'pending'].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setFilter(item as any)}
              style={[
                styles.filterButton,
                filter === item && styles.filterButtonActive
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === item && styles.filterTextActive
                ]}
              >
                {item === 'all' && 'Todas'}
                {item === 'completed' && 'Concluídas'}
                {item === 'pending' && 'Pendentes'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actionButtonsContainer}>
          <Pressable 
            style={({ pressed }) => [
              styles.actionButton,
              styles.actionButtonAdd,
              pressed && styles.actionButtonAddPressed
            ]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.actionButtonText}>Nova Tarefa</Text>
          </Pressable>

          <Pressable 
            style={({ pressed }) => [
              styles.actionButton,
              styles.deleteButton,
              pressed && styles.deleteButtonPressed
            ]}
            onPress={() => setTasks([])} 
          >
            <Text style={styles.actionButtonText}>Excluir todas</Text>
          </Pressable>
        </View>

        {/* BOTÃO SOBRE */}
        <View style={{ marginTop: 10 }}>
          <Button title="Sobre o App" onPress={() => setAboutVisible(true)} />
        </View>

        <TaskList 
          tasks={filteredTasks}
          onUpdate={updateMode} 
          onDelete={(id) => deleteTask(id, setTasks)} 
        />

        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={globalStyles.primaryColor} />
          </View>
        )}
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={resetForm}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isUpdating ? "Editar Tarefa" : "Nova Tarefa"}</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Nome da tarefa..."
              value={text}
              maxLength={50}
              onChangeText={setText}
            />

            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>
                Prioridade:
              </Text>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                {['Baixa', 'Média', 'Alta'].map((p) => (
                  <TouchableOpacity
                    key={p}
                    onPress={() => setPriority(p as any)}
                    style={[
                      styles.priorityButton,
                      priority === p && styles.priorityButtonActive
                    ]}
                  >
                    <Text style={{ color: priority === p ? '#fff' : '#000' }}>
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Data limite:</Text>
              {Platform.OS === 'web' ? (

                <input 
                  type="date"
                  value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
                  onChange={(e: any) => {
                    const val = e.target.value;
                    if (val) {
                      const parts = val.split('-');
                      setDueDate(new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
                    } else {
                      setDueDate(null);
                    }
                  }}
                  style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', flex: 1, marginLeft: 16 }}
                />
              ) : (
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerBtn}>
                    <Text>{dueDate ? dueDate.toLocaleDateString() : "Selecionar Data"}</Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={dueDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={onChangeDate}
                    />
                  )}
                </View>
              )}
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Concluída:</Text>
              <View style={styles.checkboxContainer}>
                <Checkbox
                  value={completed}
                  onValueChange={setCompleted}
                  color={completed ? globalStyles.primaryColor : undefined}
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={resetForm}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalSaveBtn, !text.trim() && styles.modalSaveBtnDisabled]} 
                onPress={handleSave}
                disabled={!text.trim()}
              >
                <Text style={styles.modalSaveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={aboutVisible}
        animationType="slide"
        onRequestClose={() => setAboutVisible(false)}
      >
        <AboutScreen onClose={() => setAboutVisible(false)} />
      </Modal>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}