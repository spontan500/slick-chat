/* ==========================================================================
   SLICK CHAT APPLICATION - STATE & LOGIC
   ========================================================================== */

const SUPABASE_URL = 'https://lqlmjsonaqvvtvhiizmj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxbG1qc29uYXF2dnR2aGlpem1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0MzMwMjcsImV4cCI6MjA5NTAwOTAyN30.gkC3j6aY1M0ulpa6jolJiXewtX46aLVhlnxKoIM5BYc';
let supabase = null;

const isPlaceholderUrl = SUPABASE_URL.includes('your-project-id') || SUPABASE_URL === '';
const isPlaceholderKey = SUPABASE_KEY === 'your-anon-key-here' || SUPABASE_KEY === '' || !SUPABASE_KEY.trim().startsWith('eyJ');

if (!isPlaceholderUrl && !isPlaceholderKey) {
  try {
    let cleanedUrl = SUPABASE_URL.trim();
    if (cleanedUrl.endsWith('/rest/v1/')) {
      cleanedUrl = cleanedUrl.substring(0, cleanedUrl.length - 9);
    } else if (cleanedUrl.endsWith('/rest/v1')) {
      cleanedUrl = cleanedUrl.substring(0, cleanedUrl.length - 8);
    }
    if (cleanedUrl.endsWith('/')) {
      cleanedUrl = cleanedUrl.substring(0, cleanedUrl.length - 1);
    }
    supabase = window.supabase.createClient(cleanedUrl, SUPABASE_KEY.trim());
  } catch (err) {
    console.error('Supabase-Verbindungsfehler:', err);
  }
}


// 1. Emoji Dictionary for Search and Picker
const EMOJI_CATEGORIES = {
  smileys: [
    { char: '😀', tags: ['smile', 'happy', 'lachen', 'froh', 'grinsen', 'freude'] },
    { char: '😂', tags: ['lol', 'lachen', 'laugh', 'tränen', 'witzig', 'heulen'] },
    { char: '🤣', tags: ['rofl', 'lachen', 'laugh', 'witzig', 'kugeln'] },
    { char: '😊', tags: ['smile', 'happy', 'froh', 'nett', 'freundlich', 'zufrieden'] },
    { char: '😍', tags: ['love', 'liebe', 'herz', 'verliebt', 'süss', 'augen'] },
    { char: '🥰', tags: ['love', 'liebe', 'herzen', 'verliebt', 'warm', 'kuscheln'] },
    { char: '😘', tags: ['kuss', 'kiss', 'liebe', 'love', 'schmatzer'] },
    { char: '😎', tags: ['cool', 'sonnenbrille', 'lässig', 'chill'] },
    { char: '😜', tags: ['zunge', 'witz', 'spaß', 'crazy', 'albern'] },
    { char: '🤔', tags: ['nachdenken', 'think', 'grübeln', 'frage', 'skepsis'] },
    { char: '😢', tags: ['cry', 'weinen', 'traurig', 'sad', 'träne'] },
    { char: '😭', tags: ['cry', 'weinen', 'traurig', 'heulen', 'schluchzen'] },
    { char: '😡', tags: ['angry', 'wütend', 'zornig', 'sauer', 'wut'] },
    { char: '😱', tags: ['angst', 'scared', 'schock', 'erstaunt', 'schrei'] },
    { char: '👍', tags: ['thumbsup', 'ja', 'ok', 'daumen', 'gut', 'top'] },
    { char: '👎', tags: ['thumbsdown', 'nein', 'schlecht', 'daumen', 'flop'] },
    { char: '👏', tags: ['clap', 'applaus', 'beifall', 'gut gemacht', 'klatschen'] },
    { char: '🙌', tags: ['celebrate', 'party', 'hände', 'super', 'juche'] },
    { char: '🙏', tags: ['pray', 'bitte', 'danke', 'hoffnung', 'namaste', 'beten'] },
    { char: '🤝', tags: ['handshake', 'deal', 'abgemacht', 'partner', 'hände'] }
  ],
  nature: [
    { char: '🐶', tags: ['hund', 'dog', 'welpe', 'haustier'] },
    { char: '🐱', tags: ['katze', 'cat', 'haustier', 'miau'] },
    { char: '🦊', tags: ['fuchs', 'fox', 'schlau'] },
    { char: '🦁', tags: ['löwe', 'lion', 'könig', 'wild'] },
    { char: '🌲', tags: ['baum', 'wald', 'tannenbaum', 'natur'] },
    { char: '🌸', tags: ['blume', 'kirschblüte', 'frühling', 'pink'] },
    { char: '🔥', tags: ['feuer', 'fire', 'heiss', 'cool', 'flamme'] },
    { char: '☀️', tags: ['sonne', 'sun', 'warm', 'hell', 'wetter'] },
    { char: '🌊', tags: ['welle', 'wasser', 'meer', 'ocean', 'strand'] },
    { char: '⭐', tags: ['stern', 'star', 'gelb', 'leuchten'] }
  ],
  food: [
    { char: '🍕', tags: ['pizza', 'essen', 'food', 'käse', 'italien'] },
    { char: '🍔', tags: ['burger', 'essen', 'food', 'fastfood', 'fleisch'] },
    { char: '🍟', tags: ['pommes', 'fries', 'essen', 'food', 'kartoffel'] },
    { char: '☕', tags: ['kaffee', 'coffee', 'tee', 'warm', 'morgen', 'tasse'] },
    { char: '🍺', tags: ['bier', 'beer', 'alkohol', 'trinken', 'feierabend'] },
    { char: '🍷', tags: ['wein', 'wine', 'alkohol', 'trinken', 'glas'] },
    { char: '🍎', tags: ['apfel', 'apple', 'obst', 'gesund', 'frucht'] },
    { char: '🍓', tags: ['erdbeere', 'strawberry', 'obst', 'süß', 'frucht'] },
    { char: '🍩', tags: ['donut', 'süß', 'backen', 'zucker'] },
    { char: '🍫', tags: ['schokolade', 'chocolate', 'süß', 'zucker'] }
  ],
  activities: [
    { char: '⚽', tags: ['fussball', 'soccer', 'sport', 'spiel', 'ball'] },
    { char: '🏀', tags: ['basketball', 'sport', 'spiel', 'ball'] },
    { char: '🎮', tags: ['controller', 'gaming', 'spiel', 'zocken', 'playstation'] },
    { char: '🎨', tags: ['malen', 'kunst', 'farben', 'pinsel', 'kreativ'] },
    { char: '🎤', tags: ['mikrofon', 'gesang', 'musik', 'karaoke', 'singen'] },
    { char: '🎧', tags: ['kopfhörer', 'musik', 'sound', 'hören'] },
    { char: '🎬', tags: ['film', 'cinema', 'kino', 'kamera', 'klappe'] },
    { char: '🚀', tags: ['rakete', 'rocket', 'weltall', 'start', 'schnell'] },
    { char: '🏆', tags: ['pokal', 'sieg', 'gewinner', 'erster', 'gold'] },
    { char: '🎉', tags: ['party', 'konfetti', 'feiern', 'geburtstag', 'juhu'] }
  ],
  objects: [
    { char: '💡', tags: ['glühbirne', 'idee', 'licht', 'strom', 'denken'] },
    { char: '💻', tags: ['laptop', 'computer', 'arbeiten', 'programmieren', 'code'] },
    { char: '📱', tags: ['handy', 'smartphone', 'telefon', 'mobil'] },
    { char: '🔑', tags: ['schlüssel', 'key', 'schloss', 'sicher'] },
    { char: '✏️', tags: ['stift', 'schreiben', 'zeichnen', 'papier'] },
    { char: '📎', tags: ['klammer', 'clip', 'anhang', 'büro'] },
    { char: '✉️', tags: ['brief', 'mail', 'post', 'nachricht'] },
    { char: '📦', tags: ['paket', 'box', 'lieferung', 'karton'] },
    { char: '🔔', tags: ['glocke', 'bell', 'alarm', 'erinnerung', 'notification'] },
    { char: '📅', tags: ['kalender', 'calendar', 'datum', 'termin'] }
  ],
  symbols: [
    { char: '❤️', tags: ['herz', 'heart', 'liebe', 'love', 'rot'] },
    { char: '💙', tags: ['herz', 'heart', 'blau', 'freundschaft'] },
    { char: '✨', tags: ['funken', 'glitzern', 'magie', 'neu', 'clean'] },
    { char: '🌟', tags: ['stern', 'star', 'leuchten', 'spektakulär'] },
    { char: '💥', tags: ['explosion', 'bumm', 'krach', 'wow'] },
    { char: '❓', tags: ['fragezeichen', 'frage', 'hilfe', 'unklar'] },
    { char: '❗', tags: ['ausrufezeichen', 'wichtig', 'achtung', 'warnung'] },
    { char: '🏁', tags: ['flagge', 'ziel', 'rennen', 'fertig'] },
    { char: '✅', tags: ['haken', 'check', 'fertig', 'erledigt', 'richtig'] },
    { char: '❌', tags: ['kreuz', 'cross', 'falsch', 'löschen', 'nein'] }
  ]
};

// 2. Mock Users Database (Simulating other users in Slack workspace)
const MOCK_USERS = {
  'user_alice': { id: 'user_alice', username: 'alice_designer', displayName: 'Alice (Design)', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Alice', status: 'online', isMock: true, role: 'UI/UX Designer' },
  'user_bob': { id: 'user_bob', username: 'bob_dev', displayName: 'Bob (Frontend Dev)', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Bob', status: 'online', isMock: true, role: 'Senior React Engineer' },
  'user_charlie': { id: 'user_charlie', username: 'charlie_pm', displayName: 'Charlie (Product)', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Charlie', status: 'online', isMock: true, role: 'Product Manager' },
  'user_diana': { id: 'user_diana', username: 'diana_qa', displayName: 'Diana (QA)', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Diana', status: 'offline', isMock: true, role: 'QA Lead' },
  'user_ethan': { id: 'user_ethan', username: 'ethan_devops', displayName: 'Ethan (Cloud)', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ethan', status: 'online', isMock: true, role: 'DevOps Engineer' }
};

// 3. Application State Object
let state = {
  currentUser: null,       // Logged in user details
  channels: [],            // List of channels { id, name, description, isPrivate, createdBy, members: [] }
  messages: [],            // List of messages { id, channelId, userId, text, timestamp, attachments: [], linkPreview: {}, reactions: {}, unreadBy: [], parentId: null }
  reminders: [],           // List of reminders { id, userId, messageId, channelId, remindAt, text, triggered: false }
  currentChannelId: null,  // Active Channel ID or active simulated User ID (for DMs)
  activeThreadParentId: null, // Message ID active in Thread panel
  draftAttachments: []     // Temporary file attachment buffer in Composer
};

// 4. Initial Database Setup (Runs if localStorage is empty)
function initializeDefaultData() {
  const defaultChannels = [
    { id: 'chan_general', name: 'general', description: 'Standard-Channel für alle Ankündigungen', isPrivate: false, createdBy: 'system', members: ['user_alice', 'user_bob', 'user_charlie', 'user_diana', 'user_ethan'] },
    { id: 'chan_random', name: 'random', description: 'Lustige Sachen, Memes und Offtopic', isPrivate: false, createdBy: 'system', members: ['user_alice', 'user_bob', 'user_charlie'] },
    { id: 'chan_development', name: 'development', description: 'Tech-Diskussionen & Code Reviews', isPrivate: false, createdBy: 'system', members: ['user_bob', 'user_ethan'] }
  ];

  const defaultMessages = [
    {
      id: 'msg_1',
      channelId: 'chan_general',
      userId: 'user_charlie',
      text: 'Willkommen im Slick Workspace! Schön, dass ihr alle da seid. 👋',
      timestamp: Date.now() - 3600000 * 4,
      attachments: [],
      reactions: { '👋': ['user_alice', 'user_bob'] },
      unreadBy: [],
      parentId: null
    },
    {
      id: 'msg_2',
      channelId: 'chan_general',
      userId: 'user_alice',
      text: 'Hallo zusammen! Ich habe das neue UI-Konzept fertiggestellt. Ihr könnt euch die Entwürfe gerne hier ansehen: https://unsplash.com/ - Feedback ist sehr willkommen! 😊',
      timestamp: Date.now() - 3600000 * 3,
      attachments: [],
      linkPreview: {
        url: 'https://unsplash.com/',
        title: 'Beautiful Free Images & Pictures | Unsplash',
        description: 'Beautiful, free images and photos that you can download and use for any project. Better than any royalty free or stock photos.',
        image: 'https://images.unsplash.com/photo-1504297050568-910d24c426d3?w=120&auto=format&fit=crop&q=60'
      },
      reactions: { '🔥': ['user_bob', 'user_charlie'], '😍': ['user_bob'] },
      unreadBy: [],
      parentId: null
    },
    {
      id: 'msg_3',
      channelId: 'chan_development',
      userId: 'user_bob',
      text: 'Habe gerade den Bug im Authentifizierungsflow gefixt. Pull Request ist auf GitHub offen: https://github.com/google/jax',
      timestamp: Date.now() - 3600000 * 2,
      attachments: [],
      linkPreview: {
        url: 'https://github.com/google/jax',
        title: 'Google JAX on GitHub',
        description: 'Composable transformations of Python+NumPy programs: differentiate, vectorize, JIT-compile to GPU/TPU, and more.',
        image: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=120&auto=format&fit=crop&q=60'
      },
      reactions: { '🚀': ['user_ethan'], '✅': ['user_ethan'] },
      unreadBy: [],
      parentId: null
    }
  ];

  localStorage.setItem('slick_channels', JSON.stringify(defaultChannels));
  localStorage.setItem('slick_messages', JSON.stringify(defaultMessages));
  localStorage.setItem('slick_reminders', JSON.stringify([]));
}

// 5. Load State from Supabase / LocalStorage
async function loadState() {
  const storedUser = localStorage.getItem('slick_current_user');
  if (storedUser) {
    state.currentUser = JSON.parse(storedUser);
    MOCK_USERS[state.currentUser.id] = state.currentUser;
  }

  if (supabase) {
    try {
      // Fetch Channels
      let { data: dbChannels, error: chanError } = await supabase.from('channels').select('*');
      if (chanError) throw chanError;

      // If Supabase channels are empty, initialize default data in the cloud!
      if (!dbChannels || dbChannels.length === 0) {
        const defaultChannels = [
          { id: 'chan_general', name: 'general', description: 'Standard-Channel für alle Ankündigungen', isPrivate: false, createdBy: 'system', members: ['user_alice', 'user_bob', 'user_charlie', 'user_diana', 'user_ethan'] },
          { id: 'chan_random', name: 'random', description: 'Lustige Sachen, Memes und Offtopic', isPrivate: false, createdBy: 'system', members: ['user_alice', 'user_bob', 'user_charlie'] },
          { id: 'chan_development', name: 'development', description: 'Tech-Diskussionen & Code Reviews', isPrivate: false, createdBy: 'system', members: ['user_bob', 'user_ethan'] }
        ];

        const defaultMessages = [
          {
            id: 'msg_1',
            channelId: 'chan_general',
            userId: 'user_charlie',
            text: 'Willkommen im Slick Workspace! Schön, dass ihr alle da seid. 👋',
            timestamp: Date.now() - 3600000 * 4,
            attachments: [],
            reactions: { '👋': ['user_alice', 'user_bob'] },
            unreadBy: [],
            parentId: null
          },
          {
            id: 'msg_2',
            channelId: 'chan_general',
            userId: 'user_alice',
            text: 'Hallo zusammen! Ich habe das neue UI-Konzept fertiggestellt. Ihr könnt euch die Entwürfe gerne hier ansehen: https://unsplash.com/ - Feedback ist sehr willkommen! 😊',
            timestamp: Date.now() - 3600000 * 3,
            attachments: [],
            linkPreview: {
              url: 'https://unsplash.com/',
              title: 'Beautiful Free Images & Pictures | Unsplash',
              description: 'Beautiful, free images and photos that you can download and use for any project. Better than any royalty free or stock photos.',
              image: 'https://images.unsplash.com/photo-1504297050568-910d24c426d3?w=120&auto=format&fit=crop&q=60'
            },
            reactions: { '🔥': ['user_bob', 'user_charlie'], '😍': ['user_bob'] },
            unreadBy: [],
            parentId: null
          },
          {
            id: 'msg_3',
            channelId: 'chan_development',
            userId: 'user_bob',
            text: 'Habe gerade den Bug im Authentifizierungsflow gefixt. Pull Request ist auf GitHub offen: https://github.com/google/jax',
            timestamp: Date.now() - 3600000 * 2,
            attachments: [],
            linkPreview: {
              url: 'https://github.com/google/jax',
              title: 'Google JAX on GitHub',
              description: 'Composable transformations of Python+NumPy programs: differentiate, vectorize, JIT-compile to GPU/TPU, and more.',
              image: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=120&auto=format&fit=crop&q=60'
            },
            reactions: { '🚀': ['user_ethan'], '✅': ['user_ethan'] },
            unreadBy: [],
            parentId: null
          }
        ];

        const { error: insertChanErr } = await supabase.from('channels').insert(defaultChannels);
        if (insertChanErr) {
          console.error('Fehler beim Initialisieren der Standardkanäle auf Supabase:', insertChanErr);
        }
        const { error: insertMsgErr } = await supabase.from('messages').insert(defaultMessages);
        if (insertMsgErr) {
          console.error('Fehler beim Initialisieren der Standardnachrichten auf Supabase:', insertMsgErr);
        }

        dbChannels = defaultChannels;
      }

      state.channels = dbChannels;

      // Fetch Messages
      let { data: dbMessages, error: msgError } = await supabase.from('messages').select('*');
      if (msgError) throw msgError;
      state.messages = dbMessages || [];

      // Fetch Reminders
      let { data: dbReminders, error: remError } = await supabase.from('reminders').select('*');
      if (remError) throw remError;
      state.reminders = dbReminders || [];

      // Hook up Real-time Synced Listeners
      setupRealtimeSubscriptions();

    } catch (err) {
      console.error('Supabase Daten-Ladefehler. Fallback auf LocalStorage:', err);
      loadLocalStorageFallback();
    }
  } else {
    loadLocalStorageFallback();
  }
}

function loadLocalStorageFallback() {
  if (!localStorage.getItem('slick_channels')) {
    initializeDefaultData();
  }
  state.channels = JSON.parse(localStorage.getItem('slick_channels'));
  state.messages = JSON.parse(localStorage.getItem('slick_messages'));
  state.reminders = JSON.parse(localStorage.getItem('slick_reminders')) || [];
}

// Set up real-time subscriptions with Supabase
function setupRealtimeSubscriptions() {
  supabase
    .channel('slick-db-sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, payload => {
      if (payload.eventType === 'INSERT') {
        if (!state.messages.some(m => m.id === payload.new.id)) {
          state.messages.push(payload.new);
          if (state.currentUser && payload.new.userId === state.currentUser.id) {
            simulateReplies(payload.new);
          } else if (payload.new.parentId && state.currentUser && state.currentUser.id !== payload.new.userId) {
            // If reply posted inside active thread, or thread simulate is needed
            const parent = state.messages.find(m => m.id === payload.new.parentId);
            if (parent && state.currentUser && parent.userId === state.currentUser.id) {
              simulateThreadReplies(payload.new);
            }
          }
        }
      } else if (payload.eventType === 'UPDATE') {
        const idx = state.messages.findIndex(m => m.id === payload.new.id);
        if (idx > -1) {
          state.messages[idx] = payload.new;
        }
      } else if (payload.eventType === 'DELETE') {
        if (payload.old && payload.old.id) {
          state.messages = state.messages.filter(m => m.id !== payload.old.id);
        }
      }

      if (!state.currentUser) return;
      renderMessageFeed();
      renderSidebar();
      if (state.activeThreadParentId) {
        renderThread();
      }
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'channels' }, payload => {
      if (payload.eventType === 'INSERT') {
        if (!state.channels.some(c => c.id === payload.new.id)) {
          state.channels.push(payload.new);
          if (state.currentUser && payload.new.createdBy === state.currentUser.id) {
            switchChannel(payload.new.id);
          }
        }
      } else if (payload.eventType === 'UPDATE') {
        const idx = state.channels.findIndex(c => c.id === payload.new.id);
        if (idx > -1) {
          state.channels[idx] = payload.new;
        }
      } else if (payload.eventType === 'DELETE') {
        if (payload.old && payload.old.id) {
          state.channels = state.channels.filter(c => c.id !== payload.old.id);
        }
      }

      if (!state.currentUser) return;
      renderSidebar();
      renderChatHeader();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'reminders' }, payload => {
      if (payload.eventType === 'INSERT') {
        if (!state.reminders.some(r => r.id === payload.new.id)) {
          state.reminders.push(payload.new);
        }
      } else if (payload.eventType === 'UPDATE') {
        const idx = state.reminders.findIndex(r => r.id === payload.new.id);
        if (idx > -1) {
          state.reminders[idx] = payload.new;
        }
      } else if (payload.eventType === 'DELETE') {
        state.reminders = state.reminders.filter(r => r.id !== payload.old.id);
      }

      if (!state.currentUser) return;
      renderSidebar();
      renderMessageFeed();
    })
    .subscribe();
}

// Save specific state fields to LocalStorage (used only as fallback or user profiles)
function saveState(field) {
  if (field === 'currentUser' || !field) {
    localStorage.setItem('slick_current_user', JSON.stringify(state.currentUser));
  }
  if (!supabase) {
    // Only save fallback arrays to localStorage if in Sandbox mode
    if (field === 'channels' || !field) {
      localStorage.setItem('slick_channels', JSON.stringify(state.channels));
    }
    if (field === 'messages' || !field) {
      localStorage.setItem('slick_messages', JSON.stringify(state.messages));
    }
    if (field === 'reminders' || !field) {
      localStorage.setItem('slick_reminders', JSON.stringify(state.reminders));
    }
  }
}

// Helper to resolve User Details (Current or Mock)
function getUser(userId) {
  return MOCK_USERS[userId] || {
    id: userId,
    displayName: 'Gelöschter User',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Deleted',
    username: 'deleted_user',
    status: 'offline'
  };
}

// ==========================================================================
// AUTHENTICATION INTERACTION
// ==========================================================================

const authScreen = document.getElementById('auth-screen');
const appScreen = document.getElementById('app-screen');
const authForm = document.getElementById('auth-form');
const avatarRadios = document.querySelectorAll('input[name="avatar"]');
const customAvatarFile = document.getElementById('custom-avatar-file');
const customAvatarRadio = document.getElementById('custom-avatar-radio');
const customAvatarPreview = document.getElementById('custom-avatar-preview');
const uploadIconContainer = document.querySelector('.upload-icon-container');

// Manage profile picture uploading in Login Modal
avatarRadios.forEach(radio => {
  radio.addEventListener('change', (e) => {
    // Unselect other visually
    document.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
    radio.closest('.avatar-option').classList.add('selected');

    if (e.target.value === 'custom') {
      customAvatarFile.click();
    }
  });
});

customAvatarFile.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (evt) {
      customAvatarPreview.src = evt.target.result;
      customAvatarPreview.style.display = 'block';
      uploadIconContainer.style.display = 'none';
      customAvatarRadio.value = evt.target.result; // Set data-url as value
    };
    reader.readAsDataURL(file);
  }
});

authForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const usernameVal = document.getElementById('username').value.trim().toLowerCase();
  const displayNameVal = document.getElementById('display-name').value.trim();
  const selectedAvatar = document.querySelector('input[name="avatar"]:checked').value;

  let avatarUrl = '';
  if (selectedAvatar.startsWith('data:image')) {
    avatarUrl = selectedAvatar; // Custom image
  } else {
    // Dicebear presets
    const seeds = { avatar1: 'Felix', avatar2: 'Marie', avatar3: 'Lukas', avatar4: 'Sophie' };
    avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${seeds[selectedAvatar] || 'User'}`;
  }

  const userId = 'user_' + Date.now();
  state.currentUser = {
    id: userId,
    username: usernameVal,
    displayName: displayNameVal,
    avatar: avatarUrl,
    status: 'online',
    isMock: false
  };

  saveState('currentUser');
  MOCK_USERS[userId] = state.currentUser;

  // Add user to existing general channel
  const updatePromises = [];
  state.channels.forEach(chan => {
    if (chan.id === 'chan_general' || chan.id === 'chan_random') {
      if (!chan.members.includes(userId)) {
        chan.members.push(userId);
        if (supabase) {
          updatePromises.push(
            supabase.from('channels').update({ members: chan.members }).eq('id', chan.id)
          );
        }
      }
    }
  });

  if (supabase) {
    Promise.all(updatePromises).then(() => {
      showMainApp();
    }).catch(err => {
      console.error('Error syncing user to channels in cloud:', err);
      showMainApp();
    });
  } else {
    saveState('channels');
    showMainApp();
  }
});

// Log out user
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('slick_current_user');
  state.currentUser = null;
  appScreen.classList.remove('app-layout');
  appScreen.style.display = 'none';
  authScreen.classList.add('active');
  authScreen.style.display = 'flex';
  authForm.reset();
  customAvatarPreview.style.display = 'none';
  uploadIconContainer.style.display = 'flex';
  document.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
  document.querySelector('.avatar-option').classList.add('selected');
});

function showMainApp() {
  authScreen.classList.remove('active');
  authScreen.style.display = 'none';
  appScreen.classList.add('app-layout');
  appScreen.style.display = 'flex';

  // Load profile layout
  document.getElementById('user-profile-img').src = state.currentUser.avatar;
  document.getElementById('user-display-name').textContent = state.currentUser.displayName;
  document.getElementById('user-handle').textContent = `@${state.currentUser.username}`;

  // Update connection status badge
  const connBadge = document.getElementById('connection-status');
  if (connBadge) {
    if (supabase) {
      connBadge.textContent = 'Cloud Online';
      connBadge.className = 'conn-badge status-online';
    } else {
      connBadge.textContent = 'Sandbox Mode';
      connBadge.className = 'conn-badge status-sandbox';
    }
  }

  // Default navigation channel
  if (state.channels && state.channels.length > 0) {
    const defaultChan = state.channels.find(c => c.id === 'chan_general') || state.channels[0];
    state.currentChannelId = defaultChan.id;
  } else {
    state.currentChannelId = 'chan_general';
  }

  initUI();
}

// ==========================================================================
// WORKSPACE NAVIGATION & RENDERING
// ==========================================================================

const channelsListEl = document.getElementById('channels-list');
const dmsListEl = document.getElementById('dms-list');
const messageFeedEl = document.getElementById('message-feed');
const chatTitleEl = document.getElementById('active-chat-title');
const chatDescEl = document.getElementById('active-chat-description');
const memberCountTextEl = document.getElementById('member-count-text');

// Re-render sidebar listings
function renderSidebar() {
  if (!state.currentUser) return;
  channelsListEl.innerHTML = '';
  dmsListEl.innerHTML = '';

  // 1. Render channels
  state.channels.forEach(chan => {
    const isUserMember = state.currentUser && chan.members && chan.members.includes(state.currentUser.id);
    if (!isUserMember && chan.isPrivate) return; // Hide private channels the user isn't in

    const hasUnread = state.currentUser && state.messages.some(msg =>
      msg.channelId === chan.id &&
      !msg.parentId &&
      msg.unreadBy &&
      msg.unreadBy.includes(state.currentUser.id)
    );

    const li = document.createElement('li');
    li.className = `sidebar-list-item ${state.currentChannelId === chan.id ? 'active' : ''} ${hasUnread ? 'unread' : ''}`;
    li.innerHTML = `
      <i data-lucide="${chan.isPrivate ? 'lock' : 'hash'}" class="item-icon"></i>
      <span class="item-name">${chan.name}</span>
    `;
    li.addEventListener('click', () => switchChannel(chan.id));
    channelsListEl.appendChild(li);
  });

  // 2. Render DMs (simulated by messaging mock users)
  Object.keys(MOCK_USERS).forEach(userId => {
    if (state.currentUser && userId === state.currentUser.id) return; // Skip self
    const u = MOCK_USERS[userId];

    const hasUnread = state.currentUser && state.messages.some(msg =>
      msg.channelId === userId &&
      !msg.parentId &&
      msg.unreadBy &&
      msg.unreadBy.includes(state.currentUser.id)
    );

    const li = document.createElement('li');
    li.className = `sidebar-list-item ${state.currentChannelId === userId ? 'active' : ''} ${hasUnread ? 'unread' : ''}`;
    li.innerHTML = `
      <img src="${u.avatar}" alt="" class="list-avatar">
      <span class="item-name">${u.displayName}</span>
      <span class="status-dot ${u.status}"></span>
    `;
    li.addEventListener('click', () => switchChannel(userId));
    dmsListEl.appendChild(li);
  });

  // 3. Render active reminders badge count
  renderRemindersList();

  // Refresh Lucide icons
  lucide.createIcons();
}

// Switch active Channel / DM view
function switchChannel(channelId) {
  state.currentChannelId = channelId;
  state.activeThreadParentId = null;
  const threadPanelEl = document.getElementById('thread-panel');
  if (threadPanelEl) {
    threadPanelEl.classList.remove('active');
  }

  if (state.currentUser) {
    // Mark all messages in this channel/DM as read
    if (supabase) {
      const unreadMsgs = state.messages.filter(msg => msg.channelId === channelId && msg.unreadBy && msg.unreadBy.includes(state.currentUser.id));
      unreadMsgs.forEach(msg => {
        const updatedUnread = msg.unreadBy.filter(id => id !== state.currentUser.id);
        supabase.from('messages').update({ unreadBy: updatedUnread }).eq('id', msg.id).then(({ error }) => {
          if (error) console.error('Error updating read receipts in Supabase:', error);
        });
      });
    } else {
      state.messages.forEach(msg => {
        if (msg.channelId === channelId && msg.unreadBy) {
          msg.unreadBy = msg.unreadBy.filter(id => id !== state.currentUser.id);
        }
      });
      saveState('messages');
    }
  }

  renderSidebar();
  renderChatHeader();
  renderMessageFeed();
}

function renderChatHeader() {
  if (!state.currentUser) return;
  const isChan = state.currentChannelId && state.currentChannelId.startsWith('chan_');
  const inviteBtn = document.getElementById('invite-btn');
  const membersBtn = document.getElementById('channel-members-btn');

  if (isChan) {
    const chan = state.channels.find(c => c.id === state.currentChannelId);
    if (chan) {
      chatTitleEl.textContent = `# ${chan.name}`;
      chatDescEl.textContent = chan.description || 'Keine Beschreibung';
      memberCountTextEl.textContent = `${chan.members.length} Mitglieder`;
      inviteBtn.style.display = 'inline-flex';
      membersBtn.style.display = 'inline-flex';
    } else {
      chatTitleEl.textContent = '# Kanal';
      chatDescEl.textContent = 'Lädt...';
      memberCountTextEl.textContent = '0 Mitglieder';
      inviteBtn.style.display = 'none';
      membersBtn.style.display = 'none';
    }
  } else if (state.currentChannelId) {
    // DM
    const u = getUser(state.currentChannelId);
    chatTitleEl.textContent = u.displayName;
    chatDescEl.textContent = `@${u.username} • ${u.role || 'Mitglied'}`;
    inviteBtn.style.display = 'none';
    membersBtn.style.display = 'none';
  } else {
    chatTitleEl.textContent = 'Willkommen bei Slick';
    chatDescEl.textContent = 'Wähle einen Channel oder eine Direktnachricht aus';
    inviteBtn.style.display = 'none';
    membersBtn.style.display = 'none';
  }
}

// Render the message feed for active Channel/DM
function renderMessageFeed() {
  if (!state.currentUser) return;
  messageFeedEl.innerHTML = '';
  const isChan = state.currentChannelId && state.currentChannelId.startsWith('chan_');

  // Filter messages for current channel/DM (parent messages only)
  const currentMessages = state.messages.filter(msg =>
    msg.channelId === state.currentChannelId && !msg.parentId
  );

  if (currentMessages.length === 0) {
    messageFeedEl.innerHTML = `
      <div class="search-empty">
        <i data-lucide="message-square" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 12px;"></i>
        <p>Dies ist der Anfang deiner Unterhaltung.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  // Find if there is an unread line indicator we should inject
  // Unread marker will appear directly above the first message unread by the current user
  let unreadDividerInjected = false;

  currentMessages.sort((a, b) => a.timestamp - b.timestamp).forEach((msg, idx) => {
    // Date Divider if day changed
    const showDateDivider = idx === 0 || new Date(currentMessages[idx - 1].timestamp).toDateString() !== new Date(msg.timestamp).toDateString();
    if (showDateDivider) {
      const divider = document.createElement('div');
      divider.className = 'date-divider';
      divider.innerHTML = `<span>${formatDateDivider(msg.timestamp)}</span>`;
      messageFeedEl.appendChild(divider);
    }

    // Unread Divider injection
    const isUnread = msg.unreadBy && msg.unreadBy.includes(state.currentUser.id);
    if (isUnread && !unreadDividerInjected) {
      const divider = document.createElement('div');
      divider.className = 'unread-divider';
      divider.innerHTML = `<span>Neue Nachrichten</span>`;
      messageFeedEl.appendChild(divider);
      unreadDividerInjected = true;
    }

    // Render Card
    const card = createMessageCard(msg);
    messageFeedEl.appendChild(card);
  });

  // Scroll to bottom
  messageFeedEl.scrollTop = messageFeedEl.scrollHeight;
  lucide.createIcons();
}

function formatDateDivider(timestamp) {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Heute';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Gestern';
  } else {
    return date.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
  }
}

function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

window.viewPdfFile = function (url, name) {
  const iframe = document.getElementById('pdf-preview-iframe');
  const title = document.getElementById('pdf-modal-title');
  if (iframe && title) {
    iframe.src = url;
    title.textContent = name;
    openModal('pdf-preview-modal');
  }
};

// Create single DOM message card (can be reused in Chat or Threads)
function createMessageCard(msg, isParentInThreadView = false) {
  const u = getUser(msg.userId);
  const card = document.createElement('div');
  card.className = `message-card ${msg.id === state.activeThreadParentId ? 'highlight' : ''}`;
  card.dataset.msgId = msg.id;

  const dateStr = new Date(msg.timestamp).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

  // Attachments HTML
  let attachmentsHtml = '';
  if (msg.attachments && msg.attachments.length > 0) {
    attachmentsHtml += '<div class="msg-attachments-container">';
    msg.attachments.forEach(file => {
      if (file.type.startsWith('image/')) {
        attachmentsHtml += `
          <div class="image-attachment-card" onclick="window.open('${file.url}', '_blank')">
            <img src="${file.url}" alt="${escapeHtml(file.name)}">
          </div>
        `;
      } else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        attachmentsHtml += `
          <div class="pdf-attachment-card">
            <div class="file-icon-box"><i data-lucide="file-text"></i></div>
            <div class="file-details">
              <div class="file-name" title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</div>
              <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
            <div class="pdf-actions" style="display: flex; gap: 4px;">
              <button type="button" class="icon-btn file-preview-btn" onclick="window.viewPdfFile('${file.url}', '${escapeHtml(file.name)}')" title="PDF vorschauen">
                <i data-lucide="eye"></i>
              </button>
              <a href="${file.url}" download="${file.name}" class="icon-btn file-download-btn" title="Herunterladen">
                <i data-lucide="download"></i>
              </a>
            </div>
          </div>
        `;
      } else {
        attachmentsHtml += `
          <div class="file-attachment-card">
            <div class="file-icon-box"><i data-lucide="file-text"></i></div>
            <div class="file-details">
              <div class="file-name" title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</div>
              <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
            <a href="${file.url}" download="${file.name}" class="icon-btn file-download-btn" title="Herunterladen"><i data-lucide="download"></i></a>
          </div>
        `;
      }
    });
    attachmentsHtml += '</div>';
  }

  // Link Preview HTML
  let previewHtml = '';
  if (msg.linkPreview && msg.linkPreview.url) {
    const p = msg.linkPreview;
    const domain = new URL(p.url).hostname.replace('www.', '');
    previewHtml = `
      <div class="link-preview-card">
        ${p.image ? `<div class="preview-thumbnail" style="background-image: url('${p.image}')"></div>` : ''}
        <div class="preview-content">
          <div class="preview-domain">${domain}</div>
          <div class="preview-title"><a href="${p.url}" target="_blank">${p.title || p.url}</a></div>
          <div class="preview-desc">${p.description || 'Keine Beschreibung verfügbar.'}</div>
        </div>
      </div>
    `;
  }

  // Reactions HTML
  let reactionsHtml = '';
  if (msg.reactions && Object.keys(msg.reactions).length > 0) {
    reactionsHtml += '<div class="msg-reactions-wrapper">';
    let hasAtLeastOneReaction = false;
    Object.keys(msg.reactions).forEach(emoji => {
      const reactors = msg.reactions[emoji];
      if (reactors.length === 0) return;
      hasAtLeastOneReaction = true;

      const userReacted = reactors.includes(state.currentUser.id);
      const namesStr = reactors.map(id => getUser(id).displayName).join(', ');

      reactionsHtml += `
        <button class="reaction-chip ${userReacted ? 'user-reacted' : ''}" onclick="toggleEmojiReaction('${msg.id}', '${emoji}')">
          <span class="reaction-emoji">${emoji}</span>
          <span class="reaction-count">${reactors.length}</span>
          <span class="reaction-tooltip">${namesStr}</span>
        </button>
      `;
    });
    if (hasAtLeastOneReaction) {
      reactionsHtml += `
        <button class="add-reaction-btn" onclick="openEmojiPicker(event, '${msg.id}')" title="Reaktion hinzufügen">
          <i data-lucide="plus"></i>
        </button>
      `;
    }
    reactionsHtml += '</div>';
  }

  // Thread Subtitle indicator
  let threadIndicatorHtml = '';
  if (!msg.parentId && !isParentInThreadView) {
    const repliesCount = state.messages.filter(m => m.parentId === msg.id).length;
    if (repliesCount > 0) {
      threadIndicatorHtml = `
        <div class="thread-replies-indicator" onclick="openThread('${msg.id}')">
          <i data-lucide="message-square-text"></i>
          <span>${repliesCount} ${repliesCount === 1 ? 'Antwort' : 'Antworten'}</span>
        </div>
      `;
    }
  }

  // Reminder tag indicator
  let reminderTagHtml = '';
  const rem = state.reminders.find(r => r.messageId === msg.id && !r.triggered);
  if (rem) {
    const timeStr = new Date(rem.remindAt).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' });
    reminderTagHtml = `
      <div class="reminder-badge" title="Erinnerung aktiv">
        <i data-lucide="bell"></i>
        <span>Erinnert am ${timeStr}</span>
      </div>
    `;
  }

  // Actions Toolbar
  let toolbarHtml = '';
  if (!isParentInThreadView) {
    toolbarHtml = `
      <div class="message-actions-toolbar">
        <button class="icon-btn" onclick="toggleEmojiReaction('${msg.id}', '👍')" title="Mit Daumen hoch reagieren">👍</button>
        <button class="icon-btn" onclick="toggleEmojiReaction('${msg.id}', '❤️')" title="Mit Herz reagieren">❤️</button>
        <button class="icon-btn" onclick="openEmojiPicker(event, '${msg.id}')" title="Reaktion hinzufügen"><i data-lucide="smile"></i></button>
        ${!msg.parentId ? `<button class="icon-btn" onclick="openThread('${msg.id}')" title="In Thread antworten"><i data-lucide="message-square-text"></i></button>` : ''}
        <button class="icon-btn" onclick="markAsUnread('${msg.id}')" title="Als ungelesen markieren"><i data-lucide="eye-off"></i></button>
        <button class="icon-btn" onclick="openReminderSetup('${msg.id}')" title="Erinnerung einstellen"><i data-lucide="bell"></i></button>
      </div>
    `;
  }

  // Render text with clickable links
  const textWithLinks = linkify(msg.text);

  card.innerHTML = `
    <img class="msg-avatar" src="${u.avatar}" alt="${u.displayName}">
    <div class="msg-content-wrapper">
      <div class="msg-header">
        <span class="msg-sender">${u.displayName}</span>
        <span class="msg-time">${dateStr}</span>
      </div>
      <div class="msg-text">${textWithLinks}</div>
      ${attachmentsHtml}
      ${previewHtml}
      ${reactionsHtml}
      ${threadIndicatorHtml}
      ${reminderTagHtml}
    </div>
    ${toolbarHtml}
  `;

  return card;
}

// Convert links in text to clickable anchors
function linkify(text) {
  const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  return text.replace(urlPattern, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Initialize Application UI Controls
function initUI() {
  renderSidebar();
  renderChatHeader();
  renderMessageFeed();

  // Textarea dynamic sizing
  const composerTextarea = document.getElementById('composer-textarea');
  if (composerTextarea) {
    let placeholderName = 'Kanal';
    if (state.currentChannelId) {
      if (state.currentChannelId.startsWith('chan_')) {
        const chan = state.channels.find(c => c.id === state.currentChannelId);
        placeholderName = chan ? '#' + chan.name : '#kanal';
      } else {
        const u = getUser(state.currentChannelId);
        placeholderName = u ? u.displayName : 'Benutzer';
      }
    }
    composerTextarea.placeholder = `Nachricht an ${placeholderName} schreiben...`;

    composerTextarea.addEventListener('input', function () {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });
  }

  // Modal Setup Close Handlers
  document.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', closeModal);
  });
}

// ==========================================================================
// MESSAGE POSTING, FILE SHARING, LINK PREVIEW GENERATION
// ==========================================================================

const messageForm = document.getElementById('message-form');
const composerTextarea = document.getElementById('composer-textarea');
const attachmentInput = document.getElementById('attachment-file-input');
const filePreviewsEl = document.getElementById('file-previews-container');

// Textarea enter checks
composerTextarea.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    const hasUploading = state.draftAttachments.some(file => file.status === 'uploading');
    if (!hasUploading) {
      messageForm.requestSubmit();
    }
  }
});

// Link inserter dialog support
document.getElementById('insert-link-btn').addEventListener('click', () => {
  openModal('link-modal');
});

document.getElementById('link-insert-form').addEventListener('submit', () => {
  const url = document.getElementById('link-url').value;
  const text = document.getElementById('link-text').value.trim();

  const linkStr = text ? `[${text}](${url})` : url;
  composerTextarea.value += (composerTextarea.value ? ' ' : '') + url;

  closeModal();
  composerTextarea.focus();
});

// Attachment trigger logic
document.getElementById('attach-file-btn').addEventListener('click', () => {
  attachmentInput.click();
});

function updateSendButtonState() {
  const sendBtn = document.getElementById('send-msg-btn');
  if (!sendBtn) return;
  const hasUploading = state.draftAttachments.some(file => file.status === 'uploading');
  if (hasUploading) {
    sendBtn.disabled = true;
    sendBtn.style.opacity = '0.5';
    sendBtn.style.cursor = 'not-allowed';
    sendBtn.title = 'Upload läuft...';
  } else {
    sendBtn.disabled = false;
    sendBtn.style.opacity = '1';
    sendBtn.style.cursor = 'pointer';
    sendBtn.title = 'Senden';
  }
}

attachmentInput.addEventListener('change', (e) => {
  const files = Array.from(e.target.files);
  if (files.length === 0) return;

  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = function (evt) {
      const fileId = 'upload_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      const item = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: evt.target.result,
        status: 'uploading',
        uploadProgress: 0
      };
      state.draftAttachments.push(item);
      renderFileDraftPreviews();
      updateSendButtonState();

      // Simulate upload progress
      const interval = setInterval(() => {
        // Find if the item still exists in draft list
        const found = state.draftAttachments.find(i => i.id === fileId);
        if (!found) {
          clearInterval(interval);
          updateSendButtonState();
          return;
        }

        if (found.uploadProgress < 100) {
          found.uploadProgress += Math.floor(Math.random() * 15) + 10;
          if (found.uploadProgress >= 100) {
            found.uploadProgress = 100;
            found.status = 'done';
            clearInterval(interval);
          }
          renderFileDraftPreviews();
          updateSendButtonState();
        }
      }, 150 + Math.random() * 150);
    };
    reader.readAsDataURL(file);
  });
  attachmentInput.value = ''; // Reset input
});

function renderFileDraftPreviews() {
  if (state.draftAttachments.length === 0) {
    filePreviewsEl.style.display = 'none';
    filePreviewsEl.innerHTML = '';
    return;
  }

  filePreviewsEl.innerHTML = '';
  filePreviewsEl.style.display = 'flex';

  state.draftAttachments.forEach((file, index) => {
    const thumb = document.createElement('div');
    thumb.className = `file-preview-thumbnail ${file.status === 'uploading' ? 'uploading' : ''}`;

    let content = '';
    if (file.type.startsWith('image/')) {
      content += `<img src="${file.url}" alt="">`;
    } else {
      const extension = file.name.split('.').pop().toUpperCase();
      content += `<span class="file-ext-label">${extension}</span>`;
    }

    if (file.status === 'uploading') {
      content += `
        <div class="upload-progress-bar-container">
          <div class="upload-progress-bar-fill" style="width: ${file.uploadProgress}%"></div>
        </div>
        <div class="upload-progress-percentage">${file.uploadProgress}%</div>
      `;
    }

    content += `<button type="button" class="remove-file-btn" onclick="removeDraftAttachment(${index})">×</button>`;
    thumb.innerHTML = content;
    filePreviewsEl.appendChild(thumb);
  });
}

window.removeDraftAttachment = function (idx) {
  state.draftAttachments.splice(idx, 1);
  renderFileDraftPreviews();
  updateSendButtonState();
};

// Auto extract first URL from text
function detectURL(text) {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const match = text.match(urlPattern);
  return match ? match[0] : null;
}

// Generate beautiful offline previews for links
function generateLinkPreview(url) {
  const lowercase = url.toLowerCase();

  if (lowercase.includes('youtube.com') || lowercase.includes('youtu.be')) {
    return {
      url,
      title: 'YouTube - Stream & Share Videos Online',
      description: 'Teile Videos mit Freunden, Familie und der ganzen Welt. Siehe dir spannende Web-Projekte und Tutorials an.',
      image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=360&auto=format&fit=crop&q=60'
    };
  } else if (lowercase.includes('github.com')) {
    return {
      url,
      title: 'GitHub: Let’s build from here · GitHub',
      description: 'GitHub is where over 100 million developers shape the future of software, collaborate, and share code.',
      image: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=360&auto=format&fit=crop&q=60'
    };
  } else if (lowercase.includes('google.com')) {
    return {
      url,
      title: 'Google',
      description: 'Suche im Internet nach Webseiten, Bildern, Videos, Nachrichten und vielem mehr.',
      image: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=360&auto=format&fit=crop&q=60'
    };
  } else if (lowercase.includes('wikipedia.org')) {
    return {
      url,
      title: 'Wikipedia, die freie Enzyklopädie',
      description: 'Wikipedia ist ein am 15. Januar 2001 gegründetes gemeinnütziges Projekt zur Erstellung einer freien Enzyklopädie.',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=360&auto=format&fit=crop&q=60'
    };
  } else if (lowercase.includes('unsplash.com')) {
    return {
      url,
      title: 'Schöne, kostenlose Fotos herunterladen | Unsplash',
      description: 'Unsplash stellt hochauflösende Fotos lizenzfrei zur Verfügung, die für private und kommerzielle Zwecke genutzt werden dürfen.',
      image: 'https://images.unsplash.com/photo-1504297050568-910d24c426d3?w=360&auto=format&fit=crop&q=60'
    };
  } else {
    // Default placeholder card
    const domain = new URL(url).hostname;
    return {
      url,
      title: `Webseite-Vorschau für ${domain}`,
      description: 'Klicke auf diesen Link, um direkt zur externen Seite zu gelangen.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=360&auto=format&fit=crop&q=60'
    };
  }
}

// Handling Composer Form submit
messageForm.addEventListener('submit', async () => {
  const text = composerTextarea.value.trim();
  const hasUploading = state.draftAttachments.some(file => file.status === 'uploading');
  if (hasUploading) return;
  if (!text && state.draftAttachments.length === 0) return;

  const msgId = 'msg_' + Date.now();
  const url = detectURL(text);
  const preview = url ? generateLinkPreview(url) : null;

  // Find users in this channel to mark message as unread for them
  let unreadUsers = [];
  if (state.currentChannelId.startsWith('chan_')) {
    const chan = state.channels.find(c => c.id === state.currentChannelId);
    unreadUsers = chan.members.filter(id => id !== state.currentUser.id);
  } else {
    // DM: Mark unread for recipient
    unreadUsers = [state.currentChannelId];
  }

  const newMsg = {
    id: msgId,
    channelId: state.currentChannelId,
    userId: state.currentUser.id,
    text: text,
    timestamp: Date.now(),
    attachments: [...state.draftAttachments],
    linkPreview: preview,
    reactions: {},
    unreadBy: unreadUsers,
    parentId: null
  };

  // Reset composer
  composerTextarea.value = '';
  composerTextarea.style.height = 'auto';
  state.draftAttachments = [];
  renderFileDraftPreviews();
  updateSendButtonState();

  if (supabase) {
    try {
      const { error } = await supabase.from('messages').insert([newMsg]);
      if (error) throw error;
    } catch (err) {
      console.error('Error inserting message to Supabase:', err);
    }
  } else {
    state.messages.push(newMsg);
    saveState('messages');

    // Re-render
    renderMessageFeed();
    renderSidebar();

    // Trigger Simulated Bot Reactions/Replies
    simulateReplies(newMsg);
  }
});

// ==========================================================================
// SIMULATED USER ACTIVITY (LIVE COLLABORATION ENABLER)
// ==========================================================================

function simulateReplies(userMsg) {
  // Check if we are in a group channel or messaging a mock user directly
  const isChan = userMsg.channelId.startsWith('chan_');
  let potentialBotUsers = [];

  if (isChan) {
    const chan = state.channels.find(c => c.id === userMsg.channelId);
    // Find online mock members of this channel
    potentialBotUsers = chan.members.filter(id => id !== state.currentUser.id && MOCK_USERS[id] && MOCK_USERS[id].isMock);
  } else {
    // Direct message: the active DM user is the bot
    const bot = MOCK_USERS[userMsg.channelId];
    if (bot && bot.isMock) {
      potentialBotUsers = [bot.id];
    }
  }

  if (potentialBotUsers.length === 0) return;

  // Choose a random user from the list to reply
  const botId = potentialBotUsers[Math.floor(Math.random() * potentialBotUsers.length)];
  const bot = MOCK_USERS[botId];

  // Set typing indicator
  const delayType = 1500 + Math.random() * 2000;
  const delayPost = delayType + 800;

  setTimeout(() => {
    showTypingIndicator(bot.displayName);
  }, 1000);

  setTimeout(() => {
    hideTypingIndicator();
    postBotReply(botId, userMsg);
  }, delayPost);
}

const typingIndicator = document.getElementById('typing-indicator');
const typingText = document.getElementById('typing-text');

function showTypingIndicator(name) {
  typingText.textContent = `${name} schreibt...`;
  typingIndicator.style.display = 'flex';
  messageFeedEl.scrollTop = messageFeedEl.scrollHeight;
}

function hideTypingIndicator() {
  typingIndicator.style.display = 'none';
}

async function postBotReply(botId, originalMsg) {
  const replyText = selectBotResponse(originalMsg.text, botId);
  const msgId = 'msg_' + Date.now();

  const newMsg = {
    id: msgId,
    channelId: originalMsg.channelId,
    userId: botId,
    text: replyText,
    timestamp: Date.now(),
    attachments: [],
    reactions: {},
    unreadBy: [state.currentUser.id], // Marked unread for active user
    parentId: null
  };

  if (supabase) {
    try {
      const { error } = await supabase.from('messages').insert([newMsg]);
      if (error) throw error;
    } catch (err) {
      console.error('Error inserting bot reply to Supabase:', err);
    }
  } else {
    state.messages.push(newMsg);
    saveState('messages');

    // If user is currently looking at this channel, trigger read update
    if (state.currentChannelId === originalMsg.channelId) {
      // Keep it unread briefly to show the red divider line or sidebar bolding
      setTimeout(() => {
        newMsg.unreadBy = newMsg.unreadBy.filter(id => id !== state.currentUser.id);
        saveState('messages');
        renderSidebar();
      }, 4000);
    }

    renderMessageFeed();
    renderSidebar();
  }

  // Also random chance to react with emoji to the user's message
  if (Math.random() > 0.4) {
    const emojis = ['👍', '❤️', '🔥', '🎉', '😊', '💡'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    setTimeout(() => {
      applyEmojiReactionState(originalMsg.id, randomEmoji, botId);
      renderMessageFeed();
      // If thread panel is open for this message, render there too
      if (state.activeThreadParentId === originalMsg.id) {
        renderThread();
      }
    }, 1200);
  }
}

// Generate contextual responses based on user messages
function selectBotResponse(userText, botId) {
  const text = userText.toLowerCase();
  const bot = MOCK_USERS[botId];

  // Specific replies by Bot Role
  if (botId === 'user_alice') { // Designer
    if (text.includes('design') || text.includes('farbe') || text.includes('layout') || text.includes('concept') || text.includes('schön')) {
      return 'Danke! Ich habe versucht, das Layout sehr modern und luftig zu gestalten. Gefallen euch die Gradienten? ✨';
    }
  }
  if (botId === 'user_bob') { // Developer
    if (text.includes('code') || text.includes('pr') || text.includes('bug') || text.includes('fehler') || text.includes('git')) {
      return 'Der Bugfix läuft stabil in unserer Staging-Umgebung. Schaut gerne mal drüber! 🚀';
    }
  }

  // General Triggers
  if (text.includes('hallo') || text.includes('hi ') || text.includes('hey')) {
    return `Hey! Hoffe du hast einen produktiven Tag. 😄`;
  }
  if (text.includes('frage') || text.includes('wie geht')) {
    return 'Gute Frage. Da bin ich mir nicht ganz sicher, vielleicht weiß jemand anderes mehr dazu? 🤔';
  }
  if (text.includes('link') || text.includes('vorschau')) {
    return 'Coole Sache! Die Link-Vorschau wird direkt sauber dargestellt. 👍';
  }
  if (text.includes('erinnerung') || text.includes('wecker')) {
    return 'Die Erinnerungs-Funktion ist super praktisch! So vergisst man nichts mehr.';
  }

  // Default Random Slack answers
  const genericReplies = [
    'Das klingt nach einem guten Plan. 👍',
    'Danke für die Info! Ich gucke mir das nachher genauer an.',
    'Können wir dazu morgen kurz abstimmen?',
    'Super Arbeit! Dankeschön. 🎉',
    'Passt für mich so.',
    'Könntest du dazu bitte einen kurzen Thread aufmachen, damit wir das geordnet besprechen?',
    'Bin gerade im Meeting, melde mich gleich dazu!'
  ];

  return genericReplies[Math.floor(Math.random() * genericReplies.length)];
}

// ==========================================================================
// EMOJI REACTION POPUP LOGIC
// ==========================================================================

const globalEmojiPicker = document.getElementById('global-emoji-picker');
const emojiSearchInput = document.getElementById('emoji-search-input');
const emojiPickerGrid = document.getElementById('emoji-picker-grid');
let activeEmojiTargetMessageId = null;

// Populate Emoji picker grid based on category and search
function populateEmojiPicker(category = 'smileys', searchQuery = '') {
  emojiPickerGrid.innerHTML = '';

  if (searchQuery) {
    // Search across all categories
    let found = 0;
    Object.keys(EMOJI_CATEGORIES).forEach(cat => {
      EMOJI_CATEGORIES[cat].forEach(emoji => {
        const matchesQuery = emoji.tags.some(tag => tag.includes(searchQuery.toLowerCase()));
        if (matchesQuery) {
          const item = createEmojiPickerItem(emoji.char);
          emojiPickerGrid.appendChild(item);
          found++;
        }
      });
    });
    if (found === 0) {
      emojiPickerGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; font-size:12px; color:var(--text-muted); padding:20px;">Keine Emojis gefunden</div>';
    }
  } else {
    // Render selected category
    EMOJI_CATEGORIES[category].forEach(emoji => {
      const item = createEmojiPickerItem(emoji.char);
      emojiPickerGrid.appendChild(item);
    });
  }
}

function createEmojiPickerItem(char) {
  const div = document.createElement('div');
  div.className = 'emoji-picker-item';
  div.textContent = char;
  div.addEventListener('click', () => {
    toggleEmojiReaction(activeEmojiTargetMessageId, char);
    closeEmojiPicker();
  });
  return div;
}

// Show the picker below or above clicked trigger
window.openEmojiPicker = function (event, messageId) {
  event.stopPropagation();
  activeEmojiTargetMessageId = messageId;
  globalEmojiPicker.classList.add('active');

  // Position the picker intelligently near the mouse/button clicked
  const rect = event.currentTarget.getBoundingClientRect();
  const pickerHeight = 380;
  const pickerWidth = 320;

  let top = rect.bottom + window.scrollY + 8;
  // If picker cuts off at screen bottom, flip it to show above
  if (top + pickerHeight > window.innerHeight + window.scrollY) {
    top = rect.top + window.scrollY - pickerHeight - 8;
  }

  let left = rect.left + window.scrollX;
  if (left + pickerWidth > window.innerWidth) {
    left = window.innerWidth - pickerWidth - 16;
  }

  globalEmojiPicker.style.top = `${top}px`;
  globalEmojiPicker.style.left = `${left}px`;

  emojiSearchInput.value = '';
  // Default to first category active tab
  document.querySelectorAll('.emoji-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector('.emoji-tab-btn[data-category="smileys"]').classList.add('active');

  populateEmojiPicker('smileys');
  emojiSearchInput.focus();
};

function closeEmojiPicker() {
  globalEmojiPicker.classList.remove('active');
  activeEmojiTargetMessageId = null;
}

// Emoji Tabs switcher
document.querySelectorAll('.emoji-tab-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.emoji-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    emojiSearchInput.value = '';
    populateEmojiPicker(btn.dataset.category);
  });
});

emojiSearchInput.addEventListener('input', (e) => {
  const query = e.target.value.trim();
  if (query) {
    // De-select category tabs visually
    document.querySelectorAll('.emoji-tab-btn').forEach(b => b.classList.remove('active'));
    populateEmojiPicker(null, query);
  } else {
    // If search cleared, fallback to first tab
    const firstTab = document.querySelector('.emoji-tab-btn');
    firstTab.classList.add('active');
    populateEmojiPicker(firstTab.dataset.category);
  }
});

// Close picker when clicking outside
document.addEventListener('click', (e) => {
  if (!globalEmojiPicker.contains(e.target) && !e.target.closest('#emoji-picker-btn')) {
    closeEmojiPicker();
  }
});

// Primary reaction toggle action
window.toggleEmojiReaction = function (msgId, emojiChar) {
  applyEmojiReactionState(msgId, emojiChar, state.currentUser.id);

  // Re-render feed
  renderMessageFeed();

  // If thread is active, update thread view too
  if (state.activeThreadParentId === msgId) {
    renderThread();
  }
};

async function applyEmojiReactionState(msgId, emojiChar, userId) {
  const msg = state.messages.find(m => m.id === msgId);
  if (!msg) return;

  // Clone reactions object to safely edit
  const currentReactions = msg.reactions ? JSON.parse(JSON.stringify(msg.reactions)) : {};

  if (!currentReactions[emojiChar]) {
    currentReactions[emojiChar] = [];
  }

  const index = currentReactions[emojiChar].indexOf(userId);
  if (index > -1) {
    // Remove reaction
    currentReactions[emojiChar].splice(index, 1);
    if (currentReactions[emojiChar].length === 0) {
      delete currentReactions[emojiChar];
    }
  } else {
    // Add reaction
    currentReactions[emojiChar].push(userId);
  }

  if (supabase) {
    try {
      const { error } = await supabase.from('messages').update({ reactions: currentReactions }).eq('id', msgId);
      if (error) throw error;
    } catch (err) {
      console.error('Error updating emoji reaction in Supabase:', err);
    }
  } else {
    msg.reactions = currentReactions;
    saveState('messages');
  }
}

// ==========================================================================
// THREADS LOGIC (PARENT & REPLY SLIDE PANEL)
// ==========================================================================

const threadPanel = document.getElementById('thread-panel');
const threadParentMsgEl = document.getElementById('thread-parent-message');
const threadRepliesListEl = document.getElementById('thread-replies-list');
const threadForm = document.getElementById('thread-form');
const threadTextarea = document.getElementById('thread-textarea');

window.openThread = function (messageId) {
  state.activeThreadParentId = messageId;
  threadPanel.classList.add('active');

  const parentMsg = state.messages.find(m => m.id === messageId);
  let chanName = 'Direktnachricht';
  if (state.currentChannelId && state.currentChannelId.startsWith('chan_')) {
    const chan = state.channels.find(c => c.id === state.currentChannelId);
    chanName = chan ? '#' + chan.name : '#kanal';
  }
  document.getElementById('thread-parent-channel').textContent = `in ${chanName}`;

  renderThread();

  // Re-render main feed to show active highlight border
  renderMessageFeed();
};

document.getElementById('close-thread-btn').addEventListener('click', () => {
  state.activeThreadParentId = null;
  threadPanel.classList.remove('active');
  renderMessageFeed();
});

function renderThread() {
  threadParentMsgEl.innerHTML = '';
  threadRepliesListEl.innerHTML = '';

  const parentMsg = state.messages.find(m => m.id === state.activeThreadParentId);
  if (!parentMsg) return;

  // Render parent card (exclude action toolbar to prevent loops)
  const parentCard = createMessageCard(parentMsg, true);
  threadParentMsgEl.appendChild(parentCard);

  // Render list of thread replies
  const replies = state.messages.filter(m => m.parentId === state.activeThreadParentId);
  if (replies.length === 0) {
    threadRepliesListEl.innerHTML = '<div style="text-align:center; font-size:12px; color:var(--text-muted); padding:20px;">Noch keine Antworten. Schreibe die erste!</div>';
  } else {
    replies.sort((a, b) => a.timestamp - b.timestamp).forEach(reply => {
      const card = createMessageCard(reply, true);
      threadRepliesListEl.appendChild(card);
    });
  }

  // Scroll replies container to bottom
  const container = document.querySelector('.thread-scrollable');
  container.scrollTop = container.scrollHeight;
  lucide.createIcons();
}

// Submit Thread Reply
threadForm.addEventListener('submit', async () => {
  const text = threadTextarea.value.trim();
  if (!text) return;

  const msgId = 'msg_' + Date.now();
  const parentMsg = state.messages.find(m => m.id === state.activeThreadParentId);

  const replyMsg = {
    id: msgId,
    channelId: state.currentChannelId,
    userId: state.currentUser.id,
    text: text,
    timestamp: Date.now(),
    attachments: [],
    reactions: {},
    parentId: state.activeThreadParentId
  };

  threadTextarea.value = '';

  if (supabase) {
    try {
      const { error } = await supabase.from('messages').insert([replyMsg]);
      if (error) throw error;
    } catch (err) {
      console.error('Error inserting thread reply to Supabase:', err);
    }
  } else {
    state.messages.push(replyMsg);
    saveState('messages');

    renderThread();
    renderMessageFeed(); // Updates replies count indicator on main card

    // Simulated reply within the thread itself!
    simulateThreadReplies(replyMsg);
  }
});

function simulateThreadReplies(userReply) {
  // If communicating in a channel or DM, choose mock bots to respond inside the thread
  const parent = state.messages.find(m => m.id === userReply.parentId);
  if (!parent) return;
  const isChan = parent.channelId && parent.channelId.startsWith('chan_');
  let potentialBotUsers = [];

  if (isChan) {
    const chan = state.channels.find(c => c.id === parent.channelId);
    if (chan) {
      potentialBotUsers = chan.members.filter(id => id !== state.currentUser.id && MOCK_USERS[id] && MOCK_USERS[id].isMock);
    }
  } else {
    const bot = MOCK_USERS[parent.channelId];
    if (bot && bot.isMock) potentialBotUsers = [bot.id];
  }

  if (potentialBotUsers.length === 0) return;

  const botId = potentialBotUsers[Math.floor(Math.random() * potentialBotUsers.length)];

  setTimeout(() => {
    const msgId = 'msg_' + Date.now();
    const replyText = selectBotResponse(userReply.text, botId);

    const botReply = {
      id: msgId,
      channelId: parent.channelId,
      userId: botId,
      text: replyText,
      timestamp: Date.now(),
      attachments: [],
      reactions: {},
      parentId: parent.id
    };

    if (supabase) {
      supabase.from('messages').insert([botReply]).catch(err => {
        console.error('Error inserting bot thread reply to Supabase:', err);
      });
    } else {
      state.messages.push(botReply);
      saveState('messages');

      // Only render if same thread is still open
      if (state.activeThreadParentId === parent.id) {
        renderThread();
      }
      renderMessageFeed();
    }
  }, 2500 + Math.random() * 2000);
}

// ==========================================================================
// UNREAD MESSAGES MANAGER
// ==========================================================================

window.markAsUnread = async function (messageId) {
  const msg = state.messages.find(m => m.id === messageId);
  if (!msg) return;

  const currentUnread = msg.unreadBy ? [...msg.unreadBy] : [];
  if (!currentUnread.includes(state.currentUser.id)) {
    currentUnread.push(state.currentUser.id);

    if (supabase) {
      try {
        const { error } = await supabase.from('messages').update({ unreadBy: currentUnread }).eq('id', messageId);
        if (error) throw error;
      } catch (err) {
        console.error('Error marking as unread in Supabase:', err);
      }
    } else {
      msg.unreadBy = currentUnread;
      saveState('messages');
      renderSidebar();
      renderMessageFeed();
    }
  }
};

// ==========================================================================
// REMINDER SERVICE & TOAST ALERT SCHEDULER
// ==========================================================================

const reminderModal = document.getElementById('reminder-modal');
const customReminderTimeInput = document.getElementById('custom-reminder-time');
let activeReminderMessageId = null;

window.openReminderSetup = function (messageId) {
  activeReminderMessageId = messageId;

  // Set default min custom time (now)
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  customReminderTimeInput.min = now.toISOString().slice(0, 16);
  customReminderTimeInput.value = '';

  openModal('reminder-modal');
};

// Handle Reminder presets clicks
document.querySelectorAll('.reminder-preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const seconds = parseInt(btn.dataset.seconds);
    const triggerTime = Date.now() + (seconds * 1000);
    setReminder(triggerTime);
  });
});

// Custom time save
document.getElementById('submit-reminder-btn').addEventListener('click', () => {
  const dateVal = customReminderTimeInput.value;
  if (!dateVal) return;

  const triggerTime = new Date(dateVal).getTime();
  if (triggerTime <= Date.now()) {
    alert('Die gewählte Zeit muss in der Zukunft liegen!');
    return;
  }

  setReminder(triggerTime);
});

async function setReminder(triggerTime) {
  const msg = state.messages.find(m => m.id === activeReminderMessageId);
  if (!msg) return;

  const reminder = {
    id: 'rem_' + Date.now(),
    userId: state.currentUser.id,
    messageId: activeReminderMessageId,
    channelId: msg.channelId,
    remindAt: triggerTime,
    text: msg.text.substring(0, 60) + (msg.text.length > 60 ? '...' : ''),
    triggered: false
  };

  closeModal();

  if (supabase) {
    try {
      const { error } = await supabase.from('reminders').insert([reminder]);
      if (error) throw error;
      showToastNotification('info', 'Erinnerung gespeichert', `Wir erinnern dich am ${new Date(triggerTime).toLocaleString('de-DE')}`);
    } catch (err) {
      console.error('Error inserting reminder into Supabase:', err);
    }
  } else {
    state.reminders.push(reminder);
    saveState('reminders');

    renderMessageFeed();
    renderSidebar();

    showToastNotification('info', 'Erinnerung gespeichert', `Wir erinnern dich am ${new Date(triggerTime).toLocaleString('de-DE')}`);
  }
}

// Background poller looking for due reminders (every 1 second)
setInterval(() => {
  if (!state.currentUser) return;

  const now = Date.now();
  let stateChanged = false;

  state.reminders.forEach(rem => {
    if (rem.userId === state.currentUser.id && !rem.triggered && rem.remindAt <= now) {
      rem.triggered = true;
      stateChanged = true;

      // Trigger beautiful floating Toast notification
      triggerReminderToast(rem);

      if (supabase) {
        supabase.from('reminders').update({ triggered: true }).eq('id', rem.id).catch(err => {
          console.error('Error updating triggered reminder in Supabase:', err);
        });
      }
    }
  });

  if (stateChanged && !supabase) {
    saveState('reminders');
    renderSidebar();
    renderMessageFeed();
  }
}, 1000);

const toastContainer = document.getElementById('toast-container');

function triggerReminderToast(reminder) {
  const toast = document.createElement('div');
  toast.className = 'toast glass';
  toast.innerHTML = `
    <i data-lucide="bell-ring" class="toast-icon"></i>
    <div class="toast-content">
      <div class="toast-title">🔔 Slick Erinnerung</div>
      <div class="toast-msg">"${reminder.text}"</div>
      <div class="toast-actions">
        <button class="btn btn-primary btn-small" onclick="viewReminderMessage('${reminder.channelId}', '${reminder.messageId}', this)">Anzeigen</button>
        <button class="btn btn-secondary btn-small" onclick="dismissToast(this)">Schließen</button>
      </div>
    </div>
  `;
  toastContainer.appendChild(toast);
  lucide.createIcons();

  // Play subtle warning sound if possible
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(520, audioCtx.currentTime); // C5
    gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.25);
  } catch (err) { }

  // Auto dismiss after 15 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.add('toast-exit');
      toast.addEventListener('animationend', () => toast.remove());
    }
  }, 15000);
}

window.dismissToast = function (btn) {
  const toast = btn.closest('.toast');
  toast.classList.add('toast-exit');
  toast.addEventListener('animationend', () => toast.remove());
};

window.viewReminderMessage = function (channelId, messageId, btn) {
  dismissToast(btn);
  switchChannel(channelId);

  // Highlight the target message cards visually
  setTimeout(() => {
    const el = document.querySelector(`.message-card[data-msg-id="${messageId}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.style.boxShadow = '0 0 20px var(--primary)';
      setTimeout(() => { el.style.boxShadow = 'none'; }, 3000);
    }
  }, 300);
};

function renderRemindersList() {
  if (!state.currentUser) return;
  const listEl = document.getElementById('reminders-list');
  const countBadge = document.getElementById('reminders-count-badge');
  listEl.innerHTML = '';

  const activeReminders = state.reminders.filter(r => r.userId === state.currentUser.id && !r.triggered);

  if (activeReminders.length === 0) {
    countBadge.style.display = 'none';
    listEl.innerHTML = '<div style="padding: 10px 12px; font-size:11px; color:var(--text-muted);">Keine aktiven Erinnerungen</div>';
    return;
  }

  countBadge.style.display = 'inline-block';
  countBadge.textContent = activeReminders.length;

  activeReminders.sort((a, b) => a.remindAt - b.remindAt).forEach(rem => {
    const li = document.createElement('li');
    li.className = 'sidebar-list-item';

    const timeStr = new Date(rem.remindAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    const isToday = new Date(rem.remindAt).toDateString() === new Date().toDateString();
    const dateStr = isToday ? `Heute ${timeStr}` : new Date(rem.remindAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }) + ` ${timeStr}`;

    li.innerHTML = `
      <i data-lucide="bell" class="item-icon" style="color:var(--warning)"></i>
      <span class="item-name" style="flex:1;">"${rem.text}"</span>
      <span style="font-size:10px; color:var(--warning); margin-left:6px; white-space:nowrap;">${dateStr}</span>
      <button onclick="deleteReminder('${rem.id}', event)" class="icon-btn-small text-danger" style="margin-left: 6px;" title="Erinnerung löschen"><i data-lucide="trash-2"></i></button>
    `;
    li.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      viewReminderMessage(rem.channelId, rem.messageId, { closest: () => ({ remove: () => { } }) });
    });
    listEl.appendChild(li);
  });
}

window.deleteReminder = async function (remId, e) {
  e.stopPropagation();
  if (supabase) {
    try {
      const { error } = await supabase.from('reminders').delete().eq('id', remId);
      if (error) throw error;
    } catch (err) {
      console.error('Error deleting reminder in Supabase:', err);
    }
  } else {
    state.reminders = state.reminders.filter(r => r.id !== remId);
    saveState('reminders');
    renderSidebar();
    renderMessageFeed();
  }
};

function showToastNotification(type, title, text) {
  const toast = document.createElement('div');
  toast.className = 'toast glass';
  let icon = 'info';
  if (type === 'success') icon = 'check-circle';
  if (type === 'error') icon = 'alert-triangle';

  toast.innerHTML = `
    <i data-lucide="${icon}" class="toast-icon" style="color: var(--primary);"></i>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${text}</div>
    </div>
  `;
  toastContainer.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.classList.add('toast-exit');
    toast.addEventListener('animationend', () => toast.remove());
  }, 4000);
}

// ==========================================================================
// CHANNEL MANAGEMENT & USER INVITATIONS
// ==========================================================================

const addChannelBtn = document.getElementById('add-channel-btn');
const createChannelForm = document.getElementById('create-channel-form');
const inviteBtn = document.getElementById('invite-btn');
const inviteUsersListEl = document.getElementById('invite-users-list');
const submitInviteBtn = document.getElementById('submit-invite-btn');
const channelMembersBtn = document.getElementById('channel-members-btn');

// Channel Creation Modal
addChannelBtn.addEventListener('click', () => {
  openModal('create-channel-modal');
  document.getElementById('new-channel-name').focus();
});

createChannelForm.addEventListener('submit', async () => {
  const nameVal = document.getElementById('new-channel-name').value.trim().toLowerCase().replace(/\s+/g, '-');
  const descVal = document.getElementById('new-channel-desc').value.trim();
  const isPrivateVal = document.getElementById('new-channel-private').checked;

  const newChanId = 'chan_' + Date.now();
  const newChan = {
    id: newChanId,
    name: nameVal,
    description: descVal,
    isPrivate: isPrivateVal,
    createdBy: state.currentUser.id,
    members: [state.currentUser.id]
  };

  createChannelForm.reset();
  closeModal();

  if (supabase) {
    try {
      const { error } = await supabase.from('channels').insert([newChan]);
      if (error) throw error;
    } catch (err) {
      console.error('Error creating channel in Supabase:', err);
    }
  } else {
    state.channels.push(newChan);
    saveState('channels');
    switchChannel(newChanId);
  }
});

// Member Invite Manager Modal
inviteBtn.addEventListener('click', () => {
  const chan = state.channels.find(c => c.id === state.currentChannelId);
  if (!chan) return;

  document.getElementById('invite-channel-name').textContent = `#${chan.name}`;
  inviteUsersListEl.innerHTML = '';

  // Get users who are not in the channel yet
  const nonMembers = Object.keys(MOCK_USERS).filter(id => !chan.members.includes(id));

  if (nonMembers.length === 0) {
    inviteUsersListEl.innerHTML = '<p style="font-size:13px; color:var(--text-muted); text-align:center;">Alle verfügbaren Personen sind bereits in diesem Channel.</p>';
    submitInviteBtn.style.display = 'none';
  } else {
    submitInviteBtn.style.display = 'block';
    nonMembers.forEach(userId => {
      const u = MOCK_USERS[userId];
      const div = document.createElement('div');
      div.className = 'checkbox-list-item';
      div.innerHTML = `
        <input type="checkbox" id="chk_${userId}" value="${userId}">
        <label for="chk_${userId}" style="display:flex; align-items:center; width:100%; cursor:pointer;">
          <img src="${u.avatar}" alt="" class="item-user-img">
          <span class="item-user-name">${u.displayName}</span>
        </label>
      `;
      inviteUsersListEl.appendChild(div);
    });
  }

  openModal('invite-modal');
});

submitInviteBtn.addEventListener('click', async () => {
  const chan = state.channels.find(c => c.id === state.currentChannelId);
  if (!chan) return;

  const checkedEl = inviteUsersListEl.querySelectorAll('input[type="checkbox"]:checked');
  const invitedIds = Array.from(checkedEl).map(el => el.value);

  if (invitedIds.length === 0) {
    closeModal();
    return;
  }

  const updatedMembers = [...chan.members, ...invitedIds];
  closeModal();

  if (supabase) {
    try {
      const { error } = await supabase.from('channels').update({ members: updatedMembers }).eq('id', chan.id);
      if (error) throw error;

      // Post dynamic cloud join notification messages and replies
      invitedIds.forEach(id => {
        const u = MOCK_USERS[id];
        const msgId = 'join_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        const joinMsg = {
          id: msgId,
          channelId: chan.id,
          userId: id,
          text: `ist dem Channel beigetreten. 👋`,
          timestamp: Date.now(),
          attachments: [],
          reactions: {},
          parentId: null
        };

        supabase.from('messages').insert([joinMsg]).then(() => {
          setTimeout(() => {
            const replyMsgId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
            const welcomeText = `Hallo zusammen! Freut mich, hier dabei zu sein. 😊`;
            const welcomeMsg = {
              id: replyMsgId,
              channelId: chan.id,
              userId: id,
              text: welcomeText,
              timestamp: Date.now(),
              attachments: [],
              reactions: {},
              parentId: null
            };
            supabase.from('messages').insert([welcomeMsg]);
          }, 2000 + Math.random() * 1000);
        });
      });
    } catch (err) {
      console.error('Error inviting users in Supabase:', err);
    }
  } else {
    chan.members = updatedMembers;
    saveState('channels');

    renderChatHeader();
    renderMessageFeed();

    // For each invited user, post a simulated join notification message and short welcome response!
    invitedIds.forEach(id => {
      const u = MOCK_USERS[id];

      // 1. Post notification
      const msgId = 'join_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      const joinMsg = {
        id: msgId,
        channelId: chan.id,
        userId: id,
        text: `ist dem Channel beigetreten. 👋`,
        timestamp: Date.now(),
        attachments: [],
        reactions: {},
        parentId: null
      };

      state.messages.push(joinMsg);
      saveState('messages');
      renderMessageFeed();

      // 2. Post short welcome reply after 1.5 seconds
      setTimeout(() => {
        const replyMsgId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        const welcomeText = `Hallo zusammen! Freut mich, hier dabei zu sein. 😊`;
        const welcomeMsg = {
          id: replyMsgId,
          channelId: chan.id,
          userId: id,
          text: welcomeText,
          timestamp: Date.now(),
          attachments: [],
          reactions: {},
          parentId: null
        };

        state.messages.push(welcomeMsg);
        saveState('messages');
        renderMessageFeed();
      }, 2000 + Math.random() * 1000);
    });
  }
});

// View Channel Members Modal
channelMembersBtn.addEventListener('click', () => {
  const chan = state.channels.find(c => c.id === state.currentChannelId);
  if (!chan) return;

  document.getElementById('members-modal-title').textContent = `Mitglieder in #${chan.name}`;
  const listEl = document.getElementById('members-list-view');
  listEl.innerHTML = '';

  chan.members.forEach(userId => {
    const u = getUser(userId);
    const li = document.createElement('li');
    li.className = 'member-detail-item';
    li.innerHTML = `
      <img src="${u.avatar}" alt="" class="member-img">
      <span class="member-name">${u.displayName} (@${u.username})</span>
      <span class="member-role">${userId === chan.createdBy ? 'Ersteller' : (u.role || 'Mitglied')}</span>
    `;
    listEl.appendChild(li);
  });

  openModal('members-modal');
});

// ==========================================================================
// CENTRALIZED SEARCH SYSTEM
// ==========================================================================

const searchModal = document.getElementById('search-modal');
const searchInput = document.getElementById('search-input');
const searchResultsEl = document.getElementById('search-results');

document.getElementById('search-trigger-btn').addEventListener('click', () => {
  openModal('search-modal');
  searchInput.value = '';
  searchResultsEl.innerHTML = '<div class="search-empty">Gib etwas ein, um nach Nachrichten zu suchen.</div>';
  searchInput.focus();
});

searchInput.addEventListener('input', (e) => {
  const query = e.target.value.trim().toLowerCase();
  if (query.length < 2) {
    searchResultsEl.innerHTML = '<div class="search-empty">Gib mindestens 2 Zeichen ein.</div>';
    return;
  }

  // Search through all parent and reply messages
  const matches = state.messages.filter(msg => {
    // Only search text content
    return msg.text && msg.text.toLowerCase().includes(query);
  });

  if (matches.length === 0) {
    searchResultsEl.innerHTML = '<div class="search-empty">Keine Nachrichten gefunden, die dem Suchbegriff entsprechen.</div>';
    return;
  }

  searchResultsEl.innerHTML = '';
  matches.sort((a, b) => b.timestamp - a.timestamp).forEach(msg => {
    const u = getUser(msg.userId);
    const div = document.createElement('div');
    div.className = 'search-result-item';

    let contextStr = '';
    if (msg.channelId && msg.channelId.startsWith('chan_')) {
      const chan = state.channels.find(c => c.id === msg.channelId);
      contextStr = `#${chan ? chan.name : 'channel'}`;
    } else if (msg.channelId) {
      contextStr = `DM mit ${getUser(msg.channelId).displayName}`;
    }

    if (msg.parentId) {
      contextStr += ' (Thread)';
    }

    div.innerHTML = `
      <img src="${u.avatar}" alt="" class="result-avatar">
      <div style="flex:1; min-width:0;">
        <div class="search-result-meta">
          <span class="search-result-sender">${u.displayName}</span>
          <span class="search-result-channel">${contextStr}</span>
        </div>
        <div class="search-result-text">${msg.text}</div>
      </div>
    `;

    div.addEventListener('click', () => {
      closeModal();

      // Load corresponding channel/DM
      switchChannel(msg.channelId);

      // Focus message card
      setTimeout(() => {
        const targetId = msg.parentId ? msg.parentId : msg.id;
        const el = document.querySelector(`.message-card[data-msg-id="${targetId}"]`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.style.boxShadow = '0 0 20px var(--primary)';
          setTimeout(() => { el.style.boxShadow = 'none'; }, 3000);

          // If it was a reply, open the thread side panel automatically
          if (msg.parentId) {
            openThread(msg.parentId);
          }
        }
      }, 4000);
    });

    searchResultsEl.appendChild(div);
  });
});

// ==========================================================================
// MODAL CORE NAVIGATION HANDLERS
// ==========================================================================

const modalContainer = document.getElementById('modal-container');
const modalCards = document.querySelectorAll('.modal-card');

function openModal(modalId) {
  modalContainer.classList.add('active');
  modalCards.forEach(card => card.classList.remove('active'));
  document.getElementById(modalId).classList.add('active');
}

function closeModal() {
  modalContainer.classList.remove('active');
  modalCards.forEach(card => card.classList.remove('active'));
  activeReminderMessageId = null;
  const iframe = document.getElementById('pdf-preview-iframe');
  if (iframe) iframe.src = '';
}

// Close modal when clicking overlay itself
modalContainer.addEventListener('click', (e) => {
  if (e.target === modalContainer) {
    closeModal();
  }
});

// ESC key closes overlays
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeEmojiPicker();
  }
});

// ==========================================================================
// APPLICATION INITIALIZATION ENTRYPOINT
// ==========================================================================

window.addEventListener('DOMContentLoaded', async () => {
  // Show visual loading spinner on button and disable it during initial loading
  const authSubmitBtn = document.getElementById('auth-submit-btn');
  let originalBtnContent = '';
  if (authSubmitBtn) {
    originalBtnContent = authSubmitBtn.innerHTML;
    authSubmitBtn.disabled = true;
    authSubmitBtn.innerHTML = `<span>Lade Slick...</span><i data-lucide="loader" class="animate-spin" style="margin-left:8px; width:16px; height:16px;"></i>`;
    lucide.createIcons();
  }

  // Wait for application state and database queries to finish loading
  await loadState();

  // Restore button status
  if (authSubmitBtn) {
    authSubmitBtn.disabled = false;
    authSubmitBtn.innerHTML = originalBtnContent;
    lucide.createIcons();
  }

  if (state.currentUser) {
    showMainApp();
  } else {
    // Show auth overlay screen
    authScreen.classList.add('active');
  }

  // Pre-load SVG icons globally
  lucide.createIcons();
});
