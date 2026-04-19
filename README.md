# 📋 Docket — Modern To-Do App

A beautifully designed, modern to-do list application with a stunning mauve theme, smooth animations, and a responsive interface. Built with vanilla JavaScript, HTML, and CSS—no frameworks required.

![Docket App](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)

---

## ✨ Features

- **🎨 Modern UI/UX** - Eye-catching mauve color palette with smooth gradients and shadows
- **📱 Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- **🌙 Dark Mode** - Toggle between light and dark themes with persistent storage
- **✅ Add, Edit, Complete** - Full task management with inline editing
- **📅 Due Dates** - Set due dates with overdue/today indicators
- **🔄 Drag & Drop** - Reorder tasks with smooth drag-and-drop interactions
- **🗑️ Undo Delete** - Toast notification with one-tap undo for deleted tasks
- **🎯 Filter Tasks** - View All, Pending, or Completed tasks with active state indicators
- **💾 Local Storage** - All tasks persist automatically in browser storage
- **⌨️ Keyboard Shortcuts** - Press `/` to focus input, `Enter` to add tasks
- **♿ Accessible** - ARIA labels, semantic HTML, keyboard navigation support
- **🎭 Smooth Animations** - Task entrance/exit animations, hover effects, and transitions
- **💝 Empty State UI** - Animated illustration for empty task list with helpful guidance

---

## 🛠️ Tech Stack

- **HTML5** - Semantic structure
- **CSS3** - Modern layout with Flexbox/Grid, CSS variables, gradients
- **JavaScript (Vanilla)** - No dependencies, pure functionality
- **Google Fonts** - Playfair Display & JetBrains Mono
- **LocalStorage API** - Persistent data management

---

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/docket-todo-app.git
   cd docket-todo-app
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js
     npx serve
     
     # Live Server (VS Code extension)
     Open with Live Server
     ```

3. **Access the app**
   - Open `http://localhost:8000` (or your port) in your browser

---

## 🚀 Usage

### Adding Tasks
1. Click in the input field or press `/` to focus
2. Type your task description (max 200 characters)
3. **(Optional)** Select a due date
4. Click `+` or press `Enter` to add

### Managing Tasks
- **Complete**: Click the checkbox
- **Edit**: Double-click the task text or click the edit icon (✎)
- **Delete**: Click the trash icon (✕)
- **Reorder**: Drag and drop tasks to reorder

### Filtering
- **All**: View all tasks
- **Pending**: View incomplete tasks only
- **Completed**: View finished tasks
- **Clear Done**: Remove all completed tasks at once

### Theme
- Click the moon/sun icon (top right) to toggle dark mode
- Your preference is saved automatically

### Keyboard Shortcuts
- `/` - Focus task input
- `Enter` - Add new task
- `Double-click` - Edit task
- `Escape` - Cancel editing

---

## 📁 File Structure

```
docket-todo-app/
├── index.html          # Main HTML structure
├── style.css           # Styling with CSS variables & animations
├── script.js           # Application logic (vanilla JS)
├── README.md           # Project documentation
└── .gitignore          # Git ignore file
```

---

## 🎨 Color Palette

The app features a modern mauve theme:

- **Primary Accent**: `#D5A3BB`
- **Secondary Accent**: `#B59EC1`
- **Light Background**: `#f5f0fc`
- **Dark Background**: `#1a101b`
- **Success**: `#6B88B8`

---

## 🌐 Browser Support

| Browser | Support |
|---------|---------|
| Chrome  | ✅ Full |
| Firefox | ✅ Full |
| Safari  | ✅ Full |
| Edge    | ✅ Full |
| Opera   | ✅ Full |

---

## 📋 Features in Detail

### Task Management
- Add unlimited tasks with descriptions (max 200 chars)
- Set optional due dates with status indicators
- Edit tasks inline with double-click
- Delete tasks with undo functionality
- Reorder tasks via drag-and-drop
- Track task count in real-time

### UI/UX Enhancements
- Animated task entrance/exit
- Smooth hover effects on cards
- Gradient buttons with shadow depth
- Glass-morphism effect on header
- Sticky input bar while scrolling
- Toast notifications for actions
- Empty state with animated illustration

### Persistence
- Auto-save to browser localStorage
- Tasks survive browser refresh
- Theme preference saved
- No server required

---

## 🔧 Customization

### Change Colors
Edit the CSS variables in `style.css`:
```css
:root {
  --accent: #D5A3BB;        /* Primary purple */
  --accent-dark: #B59EC1;   /* Secondary purple */
  --success: #6B88B8;       /* Completion indicator */
  /* ... other colors */
}
```

### Adjust Animations
Modify transition speeds in CSS:
```css
--transition: 240ms cubic-bezier(.34,.8,.32,1);
```

### Customize Fonts
Update font imports in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT&display=swap" rel="stylesheet" />
```

---

## 📱 Responsive Breakpoints

- **Desktop**: 720px+ width (full layout)
- **Tablet**: 520px - 720px (optimized spacing)
- **Mobile**: Below 520px (stacked layout)

---

## ♿ Accessibility

- ✅ ARIA labels on interactive elements
- ✅ Semantic HTML structure
- ✅ Keyboard navigation support
- ✅ Color contrast compliance
- ✅ Focus visible states
- ✅ Live region announcements for task updates

---

## 💡 Tips & Tricks

1. **Quick Add**: Press `/` anywhere to focus input
2. **Bulk Complete**: Use filters to group tasks
3. **Due Date Colors**: Red = overdue, green = today
4. **Dark Mode**: Better for night use
5. **Drag Anywhere**: Grab any task to reorder

---

## 🐛 Known Issues

None currently. Please report any bugs via [GitHub Issues](https://github.com/yourusername/docket-todo-app/issues).

---

## 🤝 Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Credits

- **Fonts**: Google Fonts (Playfair Display, JetBrains Mono)
- **Inspiration**: Modern UI/UX design principles
- **Community**: Thanks to all contributors

---

## 📞 Contact & Support

- 🐛 **Report Bugs**: [GitHub Issues](https://github.com/yourusername/docket-todo-app/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/docket-todo-app/discussions)
- 📧 **Email**: your.email@example.com

---

## 🚦 Roadmap

### Coming Soon
- [ ] Task categories/tags
- [ ] Recurring tasks
- [ ] Task notes/descriptions
- [ ] Priority levels
- [ ] Data export (JSON/CSV)
- [ ] Cloud sync support
- [ ] Mobile app version

---

## 📊 Stats

- **Lines of Code**: ~600
- **CSS Variables**: 25+
- **Animations**: 8+
- **Keyboard Shortcuts**: 4
- **Languages**: HTML, CSS, JavaScript

---

**Happy task managing! 🎉**

Created with ❤️ - Docket Todo App
