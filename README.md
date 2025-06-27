# MiniTrelloApp

A mini-Trello (Kanban) board built with Angular, NgRx, and Angular CDK DragDrop. This project was developed as part of the Smart Apartment Data Final Coding Assessment.

## Features
- **Three columns:** To Do, In Progress, Done
- **Task Input:** Input field + Add Task button (global header)
- **Auto-generated ID:** Each task gets a unique ID
- **AI-Suggested Priority:** Mock AI service suggests task priority (High/Medium/Low) with loading and error states
- **Drag & Drop:** Move cards between columns using Angular CDK
- **CRUD:** Add, update (inline), and delete tasks
- **NgRx State Management:** Store, Actions, Reducers, Selectors, Effects
- **Unit Tests:** Reducer, effect, and drag-drop service tests

## Architecture & Clean Code
- **Separation of Concerns:**
  - Components: UI only
  - Services: Business logic (AI, drag-drop)
  - Store: State logic (actions, reducer, effects, selectors)
- **SOLID & SRP:** Each class/function has one responsibility
- **Dependency Injection:** All services injected
- **Naming:** Consistent and clear (e.g., TaskCardComponent, KanbanService)
- **No Dead Code:** No unused code or console logs
- **Styling:** Minimal, readable columns/cards

## Folder Structure
```
src/app/kanban/
├── kanban.module.ts
├── components/
│   ├── board/
│   │   ├── board.component.ts
│   │   ├── board.component.html
│   │   └── board.component.scss
│   └── task-card/
│       ├── task-card.component.ts
│       ├── task-card.component.html
│       └── task-card.component.scss
├── services/
│   └── kanban.service.ts
└── store/
    ├── actions.ts
    ├── reducer.ts
    ├── selectors.ts
    ├── effects.ts
    └── state.ts
```

## Running the App
```bash
ng serve
```
Visit [http://localhost:4200/](http://localhost:4200/) in your browser.

## Running Unit Tests
```bash
ng test
```

## AI-Assisted Sections
This project leveraged AI tools (ChatGPT, Copilot) for:
- NgRx effect boilerplate (see `kanban.effects.ts`)
- Mock AI service for priority suggestion (see `priority.service.ts`)
- Drag-drop handler (see `drag-drop.service.ts`)
- Test scaffolding for reducer, effects, and drag-drop service

### Example Prompts Used
- "Write an NgRx effect that listens for fetchPriority, calls a mock service, and dispatches success/failure actions."
- "Create a mock Angular service that returns a random priority after a delay."
- "Write a Jasmine test for a drag-drop service that dispatches an action when a card is moved between columns."
- "Extract the add task form into a reusable Angular component."
- "Update the README file accordingly."

### Example AI-Generated Code (with manual validation/refinement)
#### NgRx Effect (kanban.effects.ts)
```ts
fetchPriority$ = createEffect(() => {
  return this.actions$.pipe(
    ofType(KanbanActions.fetchPriority),
    mergeMap(({ taskId }) => 
      this.priorityService.getPriority(taskId).pipe(
        map(priority => KanbanActions.fetchPrioritySuccess({ taskId, priority })),
        catchError(error => of(KanbanActions.fetchPriorityFailure({ 
          taskId, 
          error: error.message || 'Failed to fetch priority' 
        })))
      )
    )
  );
});
```
#### Mock AI Service (priority.service.ts)
```ts
getPriority(taskId: string): Observable<Priority> {
  const priorities: Priority[] = ['High', 'Medium', 'Low'];
  const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
  return of(randomPriority).pipe(delay(1000));
}
```
#### Drag & Drop Handler (drag-drop.service.ts)
```ts
onDrop(event: CdkDragDrop<Task[]>): void {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    const task = event.container.data[event.currentIndex];
    const newStatus = this.getStatusFromContainerId(event.container.id);
    this.store.dispatch(KanbanActions.updateTaskStatus({ taskId: task.id, status: newStatus }));
  }
}
```

## Validation & Refinement
- **Manual Review:** All AI-generated code was reviewed and refactored for clarity, correctness, and integration with the codebase.
- **Testing:**
  - Unit tests for reducer, effects, and drag-drop service (see `kanban.reducer.spec.ts`, `kanban.effects.spec.ts`, `drag-drop.service.spec.ts`)
  - Example test:
    ```ts
    it('should add a new task to the state', () => {
      const taskId = 'test-uuid';
      const title = 'Test Task';
      const action = KanbanActions.addTaskWithId({ title, taskId });
      const result = kanbanReducer(initialState, action);
      expect(result.tasks.length).toBe(1);
      expect(result.tasks[0]).toEqual({
        id: taskId,
        title,
        status: 'todo',
        priority: undefined,
        loadingPriority: true,
        errorPriority: undefined
      });
    });
    ```
- **Refinement:** Adjusted effect logic, drag-drop handler, and test cases to match assessment requirements and fix edge cases.

## Assessment Coverage
- [x] Board view with three columns
- [x] Task input with auto-generated ID
- [x] AI-driven priority with loading/error state
- [x] Drag & drop between columns
- [x] CRUD operations (add, update, delete)
- [x] NgRx state management (actions, reducer, effects, selectors)
- [x] Unit tests for reducer, effects, drag-drop
- [x] Clean code, separation of concerns, and best practices

---

For any questions, please contact the author.
