import { useState, useCallback, useRef } from "react";

/* ─── INDIVIDUAL PICKER ─────────────────────────────── */
const PEOPLE = [
  { id:'p1', name:'Aswin Kumar',     initials:'AK', color:'#3b82f6' },
  { id:'p2', name:'Sarath R',        initials:'SR', color:'#8b5cf6' },
  { id:'p3', name:'Lisa Clark',      initials:'LC', color:'#ec4899' },
  { id:'p4', name:'Vishal Noel',     initials:'VN', color:'#ef4444' },
  { id:'p5', name:'Tsakane Dlamini', initials:'TD', color:'#10b981' },
  { id:'p6', name:'Navin B',         initials:'NB', color:'#0369a1' },
  { id:'p7', name:'Sampath Kumar',   initials:'SK', color:'#f59e0b' },
];

function IndividualPicker({ selected, onChange }) {
  const [open, setOpen] = useState(false);
  const toggle = id => onChange(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const selectedPeople = PEOPLE.filter(p => selected.includes(p.id));

  return (
    <div style={{ position: 'relative' }}>
      <div onClick={() => setOpen(p => !p)}
        style={{ display: 'flex', alignItems: 'center', gap: 5, border: '1px solid #e5e7eb', borderRadius: 5, padding: '5px 10px', background: '#fff', cursor: 'pointer', minWidth: 160, userSelect: 'none' }}>
        {selectedPeople.length === 0 ? (
          <span style={{ fontSize: 12.5, color: '#9ca3af' }}>Select people…</span>
        ) : (
          <>
            <div style={{ display: 'flex' }}>
              {selectedPeople.slice(0, 3).map((p, i) => (
                <div key={p.id} style={{ width: 20, height: 20, borderRadius: '50%', background: p.color, color: '#fff', fontSize: 7, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: i > 0 ? -5 : 0, border: '1.5px solid #fff', flexShrink: 0 }}>{p.initials}</div>
              ))}
            </div>
            <span style={{ fontSize: 12, color: '#374151' }}>
              {selectedPeople.slice(0, 2).map(p => p.name.split(' ')[0]).join(', ')}
              {selectedPeople.length > 2 && <span style={{ background: '#f3f4f6', color: '#374151', borderRadius: 10, padding: '1px 6px', fontSize: 10.5, fontWeight: 600, marginLeft: 4 }}>+{selectedPeople.length - 2}</span>}
            </span>
          </>
        )}
        <span style={{ color: '#9ca3af', fontSize: 9, marginLeft: 'auto', paddingLeft: 4 }}>&#9660;</span>
      </div>

      {open && (
        <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 7, boxShadow: '0 6px 20px rgba(0,0,0,.12)', zIndex: 600, width: 220, overflow: 'hidden' }}>
          {PEOPLE.map(p => {
            const isSelected = selected.includes(p.id);
            return (
              <div key={p.id} onClick={() => toggle(p.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', cursor: 'pointer', background: isSelected ? '#eff6ff' : '#fff', transition: 'background .1s' }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#f9fafb'; }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = '#fff'; }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: p.color, color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{p.initials}</div>
                <span style={{ fontSize: 12.5, color: isSelected ? '#1e40af' : '#374151', flex: 1, fontWeight: isSelected ? 500 : 400 }}>{p.name}</span>
                {isSelected && <span style={{ color: '#1e40af', fontSize: 13, fontWeight: 700 }}>✓</span>}
              </div>
            );
          })}
          {selected.length > 0 && (
            <div onClick={() => onChange([])} style={{ padding: '6px 12px', borderTop: '1px solid #f3f4f6', fontSize: 12, color: '#6b7280', cursor: 'pointer', textAlign: 'center' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
              Clear all
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── ALERTS MODAL ──────────────────────────────────── */
function AlertsModal({ searchLabel, onClose }) {
  const METRICS = [
    { id: 'neg', label: 'Negative sentiment'  },
    { id: 'pos', label: 'Positive sentiment'  },
    { id: 'eng', label: 'Engagement'          },
    { id: 'vol', label: 'Conversation volume' },
  ];
  const THRESHOLD_OPTS = ['Moderate increase', 'Substantial increase'];

  const [checked,       setChecked]       = useState({});
  const [thresholds,    setThresholds]    = useState(() => Object.fromEntries(METRICS.map(m => [m.id, THRESHOLD_OPTS[0]])));
  const [notifyType,    setNotifyType]    = useState('individual');
  const [selectedPeople,setSelectedPeople]= useState([]);
  const [viaChannel,    setViaChannel]    = useState('In-app');
  const [saved,         setSaved]         = useState(false);

  const toggle = id => setChecked(p => ({ ...p, [id]: !p[id] }));
  const canCreate = Object.values(checked).some(Boolean);

  const Sel = ({ value, opts, onChange, width }) => (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ border: '1px solid #e5e7eb', borderRadius: 5, padding: '5px 8px', fontSize: 12, background: '#fff', cursor: 'pointer', color: '#374151', width: width || 'auto' }}>
      {opts.map(o => <option key={o}>{o}</option>)}
    </select>
  );

  if (saved) return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 10, width: 400, padding: 32, textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🔔</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 8 }}>Alert created</div>
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>You will be notified about changes in <b>"{searchLabel}"</b>.</div>
        <button onClick={onClose} style={{ background: '#1e40af', color: '#fff', border: 'none', borderRadius: 5, padding: '8px 24px', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>Done</button>
      </div>
    </div>
  );

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 10, width: 520, boxShadow: '0 20px 60px rgba(0,0,0,.2)', display: 'flex', flexDirection: 'column' }}>

        {/* ── Header ── */}
        <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Alerts</div>
            <div style={{ fontSize: 12.5, color: '#6b7280', marginTop: 3 }}>Get notified about changes in <b style={{ color: '#374151' }}>"{searchLabel}"</b>.</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#9ca3af', lineHeight: 1, padding: '2px 4px' }}>x</button>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: '18px 22px' }}>

          {/* Alert metrics */}
          <div style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Alert metrics</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 22 }}>
            {METRICS.map(m => (
              <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '1fr 180px', alignItems: 'center', gap: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={!!checked[m.id]} onChange={() => toggle(m.id)}
                    style={{ width: 15, height: 15, cursor: 'pointer', accentColor: '#1e40af', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: checked[m.id] ? '#111827' : '#6b7280', fontWeight: checked[m.id] ? 500 : 400, transition: 'color .15s' }}>{m.label}</span>
                </label>
                <Sel value={thresholds[m.id]} opts={THRESHOLD_OPTS} onChange={v => setThresholds(p => ({ ...p, [m.id]: v }))} width={180} />
              </div>
            ))}
          </div>

          {/* divider */}
          <div style={{ height: 1, background: '#f3f4f6', marginBottom: 18 }} />

          {/* Notification */}
          <div style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14 }}>Notification</div>

          {/* Row: type dropdown + conditional people/team picker + via channel */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>

            {/* Notify type dropdown */}
            <select value={notifyType} onChange={e => setNotifyType(e.target.value)}
              style={{ border: '1px solid #e5e7eb', borderRadius: 5, padding: '6px 10px', fontSize: 12.5, background: '#fff', cursor: 'pointer', color: '#374151' }}>
              <option value="individual">Notify individual(s)</option>
              <option value="team">Team notification</option>
            </select>

            {/* Individual: people multi-select dropdown */}
            {notifyType === 'individual' && (
              <IndividualPicker selected={selectedPeople} onChange={setSelectedPeople} />
            )}

            {/* Team: notify all label */}
            {notifyType === 'team' && (
              <span style={{ fontSize: 12.5, color: '#6b7280', fontStyle: 'italic' }}>All team members will be notified</span>
            )}

            {/* Via label + In-app / Email toggle */}
            <span style={{ fontSize: 12.5, color: '#6b7280', flexShrink: 0 }}>via</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {['In-app', 'Email'].map(ch => (
                <button key={ch} onClick={() => setViaChannel(ch)}
                  style={{ padding: '5px 14px', borderRadius: 5, border: `1px solid ${viaChannel === ch ? '#1e40af' : '#e5e7eb'}`, background: viaChannel === ch ? '#eff6ff' : '#fff', color: viaChannel === ch ? '#1e40af' : '#6b7280', fontSize: 12, cursor: 'pointer', fontWeight: viaChannel === ch ? 500 : 400, transition: 'all .15s' }}>
                  {ch}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{ padding: '14px 22px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose} style={{ border: '1px solid #e5e7eb', borderRadius: 5, padding: '7px 16px', fontSize: 13, cursor: 'pointer', background: '#fff', color: '#374151' }}>Cancel</button>
          <button disabled={!canCreate} onClick={() => { if (canCreate) setSaved(true); }}
            style={{ background: canCreate ? '#1e40af' : '#bfdbfe', color: '#fff', border: 'none', borderRadius: 5, padding: '7px 18px', fontSize: 13, cursor: canCreate ? 'pointer' : 'not-allowed', fontWeight: 500 }}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}


/* ─── DATA ──────────────────────────────────────────── */
const ASSIGNEE_COLORS = {
  'Aswin Kumar':'#3b82f6','Sarath R':'#8b5cf6','Lisa Clark':'#ec4899',
  'Sampath Kumar. J':'#f59e0b','Tsakane Dlamini':'#10b981','Vishal Noel':'#ef4444',
};
const TEAMS = {
  'Aswin Kumar':'AK','Sarath R':'SR','Lisa Clark':'LC',
  'Sampath Kumar. J':'SK','Tsakane Dlamini':'TD','Vishal Noel':'VN',
};
const NET_BG = {x:'#000',ig:'#e1306c',rd:'#ff4500',fb:'#1877f2',yt:'#ff0000',th:'#1a1a2e',li:'#0a66c2',gl:'#34a853'};
const NET_SYM = {x:'𝕏',ig:'◉',rd:'●',fb:'f',yt:'▶',th:'@',li:'in',gl:'G'};
const NET_LABEL = {x:'X',ig:'Instagram',rd:'Reddit',fb:'Facebook',yt:'YouTube',th:'Threads',li:'LinkedIn',gl:'Google'};
const DISC_NETS = ['fb','x','ig','rd','th','yt'];

const INTERACTIONS = [
  {id:'i1',net:'x',date:'16 Jul 2026',time:'09:06 PM',author:'DURAIMANICKAM S',handle:'@s_duraiman89394',avatar:'DS',bg:'#1f2937',snippet:'@s_duraiman89394 Test reply to Zylker',tag:'REPLY',priority:'Low',assignee:'Aswin Kumar',status:'Open',unread:true,convTitle:'DURAIMANICKAM S replied on your tweet 😊',origPost:'Ready to explore the world? Check out the amazing travel deals at Zylker Travels! Book now! #TravelGoals',origTime:'19 May 2026 11:47 AM',content:'@ZylkerTravels Wow duper',replyTime:'21 May 2026 03:48 PM',canEngage:true,deleted:true,activity:[{icon:'blue',text:'Interaction assigned to Aswin Kumar by Vishal Noel',time:'20 Jul 2026 01:19 PM'},{icon:'yellow',text:'Status changed to Open',time:'16 Jul 2026 09:06 PM'}],userInfo:{Platform:'X (Twitter)',Type:'Reply',Followers:'1,204',Following:'348','Account created':'Mar 2019'}},
  {id:'i2',net:'x',date:'04 May 2026',time:'03:19 PM',author:'Ubuntu Lover',handle:'@ubuntulover_k',avatar:'UL',bg:'#dc2626',snippet:'@SharathRK @ZylkerTravels – yes!',tag:'REPLY',priority:'High',assignee:'Sarath R',status:'Open',unread:false,convTitle:'Ubuntu Lover replied on your tweet',origPost:'@ZylkerTravels Any thoughts on the Maldives packages?',origTime:'04 May 2026 03:00 PM',content:'@SharathRK @ZylkerTravels – yes!',replyTime:'04 May 2026 03:19 PM',canEngage:true,activity:[{icon:'blue',text:'Interaction assigned to Sarath R by lihang+demo',time:'04 May 2026 04:00 PM'}],userInfo:{Platform:'X (Twitter)',Type:'Reply',Followers:'892',Following:'210'}},
  {id:'i3',net:'x',date:'04 May 2026',time:'03:19 PM',author:'Sharath R',handle:'@SharathRK',avatar:'SR',bg:'#7c3aed',snippet:'@SharathRK @ZylkerTravels – yes!',tag:'MENTION',priority:'Medium',assignee:'Lisa Clark',status:'Under Review',unread:false,convTitle:'Sharath R mentioned you',content:'@SharathRK @ZylkerTravels – yes! Great deals',replyTime:'04 May 2026 03:19 PM',canEngage:true,activity:[{icon:'yellow',text:'Lihang+demo changed status to Under Review',time:'04 May 2026 03:30 PM'}],userInfo:{Platform:'X (Twitter)',Type:'Mention',Followers:'3,421',Following:'567'}},
  {id:'i4',net:'x',date:'04 May 2026',time:'03:17 PM',author:'zylkerHQ',handle:'@zylkerhq_fan',avatar:'ZH',bg:'#0369a1',snippet:'hey @ZylkerTravels, are the deals still active?',tag:'MENTION',priority:'Low',assignee:'Sampath Kumar. J',status:'Closed',unread:false,convTitle:'zylkerHQ mentioned you',content:'hey @ZylkerTravels, are the deals on your homepage still active? #deals',replyTime:'04 May 2026 03:17 PM',canEngage:true,activity:[{icon:'gray',text:'Lihang+demo changed status to Closed',time:'04 May 2026 03:17 PM'}],userInfo:{Platform:'X (Twitter)',Type:'Mention',Followers:'654',Following:'123'}},
  {id:'i5',net:'x',date:'01 May 2026',time:'11:22 AM',author:'Navin B',handle:'@NavinB70218165',avatar:'NB',bg:'#b45309',snippet:"Hello! It's great to hear from you, Zylker!",tag:'REPLY',priority:'Low',assignee:'',status:'Open',unread:true,convTitle:'Navin B replied',content:"@NavinB70218165 Hello! It's great to hear from you, Zylker! How can I assist today? 😊",replyTime:'01 May 2026 11:22 AM',canEngage:true,activity:[],userInfo:{Platform:'X (Twitter)',Type:'Reply',Followers:'209',Following:'441'}},
  {id:'i6',net:'x',date:'29 Apr 2026',time:'08:45 AM',author:'TravelTalkDaily',handle:'@traveltalkdaily',avatar:'TT',bg:'#0284c7',snippet:'@ZylkerTravels your Bangkok packages are incredible!',tag:'MENTION',priority:'Medium',assignee:'Aswin Kumar',status:'Open',unread:true,convTitle:'TravelTalkDaily mentioned you',content:'@ZylkerTravels your Bangkok packages are incredible. Booked for Nov! 🎉 #ZylkerTravels',replyTime:'29 Apr 2026 08:45 AM',canEngage:true,activity:[{icon:'blue',text:'Aswin Kumar assigned this interaction',time:'29 Apr 2026 09:10 AM'}],userInfo:{Platform:'X (Twitter)',Type:'Mention',Followers:'12,430',Following:'890'}},
  {id:'i7',net:'fb',date:'28 Apr 2026',time:'07:30 PM',author:'Girish M',handle:'Zylker Travels page',avatar:'GM',bg:'#1877f2',snippet:'Hi Zylker, does the Dubai package include visa assistance?',tag:'COMMENT',priority:'High',assignee:'Lisa Clark',status:'Open',unread:true,convTitle:'Girish M commented on your post',origPost:'Our Dubai Extravaganza package is live! 5 nights, 4 stars. Book before May 15! #Dubai',origTime:'27 Apr 2026 10:00 AM',content:'Hi Zylker, does the Dubai package include visa assistance? Also what about airport transfers?',replyTime:'28 Apr 2026 07:30 PM',canEngage:true,activity:[{icon:'blue',text:'Interaction assigned to Lisa Clark by Vishal Noel',time:'28 Apr 2026 08:00 PM'}],userInfo:{Platform:'Facebook',Type:'Comment',Location:'Chennai, India'}},
  {id:'i8',net:'fb',date:'27 Apr 2026',time:'02:14 PM',author:'Priya Sundaram',handle:'Zylker Travels page',avatar:'PS',bg:'#6d28d9',snippet:'Just got back from Bali trip — absolutely worth every rupee!',tag:'COMMENT',priority:'Low',assignee:'Sampath Kumar. J',status:'Closed',unread:false,convTitle:'Priya Sundaram commented on your post',origPost:'Bali awaits you! 7 nights from ₹55,000 per person. #Bali #ZylkerTravels',origTime:'20 Apr 2026 09:00 AM',content:'Just got back from the Bali trip — absolutely worth every rupee! The resort was stunning. 🌺',replyTime:'27 Apr 2026 02:14 PM',canEngage:true,activity:[{icon:'green',text:'Sampath Kumar. J replied to this comment',time:'27 Apr 2026 03:00 PM'},{icon:'gray',text:'Status changed to Closed',time:'27 Apr 2026 03:05 PM'}],userInfo:{Platform:'Facebook',Type:'Comment',Location:'Bangalore, India'}},
  {id:'i9',net:'fb',date:'26 Apr 2026',time:'11:48 AM',author:'Rajesh Kumar',handle:'Zylker Travels inbox',avatar:'RK',bg:'#b45309',snippet:'Hi, I want to know more about your Europe group tour package.',tag:'DM',priority:'High',assignee:'Vishal Noel',status:'Under Review',unread:true,convTitle:'Rajesh Kumar sent you a message',content:'Hi, I want to know more about your Europe group tour package. How many cities? What is the duration?',replyTime:'26 Apr 2026 11:48 AM',canEngage:true,activity:[{icon:'blue',text:'Assigned to Vishal Noel',time:'26 Apr 2026 12:00 PM'}],userInfo:{Platform:'Facebook',Type:'Direct Message',Location:'Mumbai, India'}},
  {id:'i10',net:'fb',date:'25 Apr 2026',time:'05:22 PM',author:'Anitha Rajan',handle:'Zylker Travels page',avatar:'AR',bg:'#ec4899',snippet:'Can you share itinerary for the Rajasthan package?',tag:'COMMENT',priority:'Medium',assignee:'Lisa Clark',status:'Closed',unread:false,convTitle:'Anitha Rajan commented on your post',origPost:'Experience Royal Rajasthan! 8 days covering Jaipur, Jodhpur, Udaipur. #Rajasthan',origTime:'22 Apr 2026 11:00 AM',content:'Can you share the detailed itinerary for the Rajasthan package? Also is it suitable for elderly parents?',replyTime:'25 Apr 2026 05:22 PM',canEngage:true,activity:[{icon:'green',text:'Lisa Clark replied and closed',time:'25 Apr 2026 06:00 PM'}],userInfo:{Platform:'Facebook',Type:'Comment',Location:'Coimbatore, India'}},
  {id:'i11',net:'ig',date:'24 Apr 2026',time:'10:30 AM',author:'wanderlust_asha',handle:'@wanderlust_asha',avatar:'WA',bg:'#e1306c',snippet:'Your Santorini reel just made me book my trip! 😍🌊',tag:'COMMENT',priority:'Low',assignee:'Sarath R',status:'Open',unread:true,convTitle:'wanderlust_asha commented on your reel',origPost:'Santorini calling! 6-night package starts at ₹1.2L. #Santorini #ZylkerTravels #Greece',origTime:'23 Apr 2026 09:00 AM',content:'Your Santorini reel just made me book my trip! 😍🌊 How do I reach you?',replyTime:'24 Apr 2026 10:30 AM',canEngage:true,activity:[{icon:'blue',text:'Sarath R assigned this interaction',time:'24 Apr 2026 11:00 AM'}],userInfo:{Platform:'Instagram',Type:'Comment',Followers:'4,210',Following:'512'}},
  {id:'i12',net:'ig',date:'23 Apr 2026',time:'08:15 PM',author:'travelwith_meera',handle:'@travelwith_meera',avatar:'TM',bg:'#6d28d9',snippet:'DMed you about the Maldives package. Pls reply! 🙏',tag:'MENTION',priority:'High',assignee:'Aswin Kumar',status:'Open',unread:true,convTitle:'travelwith_meera mentioned you',content:'@ZylkerTravels DMed you about the Maldives package. Pls reply! 🙏 Been waiting 2 days',replyTime:'23 Apr 2026 08:15 PM',canEngage:true,activity:[{icon:'blue',text:'Aswin Kumar assigned',time:'23 Apr 2026 09:00 PM'},{icon:'yellow',text:'Priority changed to High',time:'23 Apr 2026 09:05 PM'}],userInfo:{Platform:'Instagram',Type:'Story Reply',Followers:'28,100',Following:'890'}},
  {id:'i13',net:'ig',date:'22 Apr 2026',time:'06:44 PM',author:'girish_mohan_doss',handle:'@girish_mohan_doss',avatar:'GD',bg:'#0284c7',snippet:'Hi how can I help',tag:'COMMENT',priority:'Medium',assignee:'Lisa Clark',status:'Closed',unread:false,convTitle:'girish_mohan_doss commented on your post',origPost:'Discover Europe your way! Starting ₹85K. #Europe #Travel',origTime:'21 Apr 2026 10:00 AM',content:'Hi how can I help',replyTime:'22 Apr 2026 06:44 PM',canEngage:true,activity:[{icon:'gray',text:'Tsakane Dlamini changed status to Closed',time:'22 Apr 2026 07:00 PM'}],userInfo:{Platform:'Instagram',Type:'Comment',Followers:'342',Following:'580'}},
  {id:'i14',net:'ig',date:'21 Apr 2026',time:'04:22 PM',author:'solo_trek_nisha',handle:'@solo_trek_nisha',avatar:'SN',bg:'#10b981',snippet:'What solo travel options do you have for women? #safetravel',tag:'COMMENT',priority:'High',assignee:'Vishal Noel',status:'Under Review',unread:true,convTitle:'solo_trek_nisha commented on your reel',origPost:'Southeast Asia solo tour — perfect for independent explorers! #SoloTravel',origTime:'20 Apr 2026 08:00 AM',content:'What are the solo travel options you have for women? Safety is my priority! #safetravel',replyTime:'21 Apr 2026 04:22 PM',canEngage:true,activity:[{icon:'blue',text:'Vishal Noel assigned and set priority High',time:'21 Apr 2026 05:00 PM'}],userInfo:{Platform:'Instagram',Type:'Comment',Followers:'15,600',Following:'420'}},
  {id:'i15',net:'yt',date:'20 Apr 2026',time:'02:10 PM',author:'Aki Balaji',handle:'@akibalaji',avatar:'AB',bg:'#dc2626',snippet:'hey macha this video is fire! Book kara poren da 🔥',tag:'COMMENT',priority:'Low',assignee:'',status:'Open',unread:true,convTitle:'Aki Balaji commented on your video',origPost:'TOP 10 Travel Destinations 2026 | Zylker Travels | Budget Options Inside!',origTime:'18 Apr 2026 10:00 AM',content:'hey macha this video is fire! Book kara poren da 🔥🔥 @ZylkerTravels',replyTime:'20 Apr 2026 02:10 PM',engagements:'128 engagements',canEngage:true,activity:[],userInfo:{Platform:'YouTube',Type:'Comment',Channel:'akibalaji'}},
  {id:'i16',net:'yt',date:'19 Aug 2026',time:'10:09 PM',author:'Arason',handle:'@arason_travel',avatar:'AR',bg:'#f59e0b',snippet:'Yes, I can respond in Chinese if you want to switch…',tag:'COMMENT',priority:'Low',assignee:'',status:'Closed',unread:false,convTitle:'Arason commented on your video',origPost:'China Travel Guide 2026 | Zylker Travels',origTime:'15 Aug 2026 09:00 AM',content:"Yes, I can understand and respond in Chinese. If you'd like to switch to Chinese, we can continue.",replyTime:'19 Aug 2026 10:09 PM',engagements:'89 engagements',canEngage:true,activity:[{icon:'gray',text:'Status changed to Closed',time:'19 Aug 2026 11:00 PM'}],userInfo:{Platform:'YouTube',Type:'Comment',Channel:'arason_travel'}},
  {id:'i17',net:'yt',date:'18 Aug 2026',time:'11:34 AM',author:'DeepakVlog',handle:'@deepakvlog',avatar:'DV',bg:'#7c3aed',snippet:'Bhai which camera do you use? Zylker collabs karo!',tag:'COMMENT',priority:'Low',assignee:'',status:'Open',unread:false,convTitle:'DeepakVlog commented on your video',origPost:'Kerala Backwaters Travel Vlog | Zylker Travels',origTime:'17 Aug 2026 08:00 AM',content:'Bhai which camera do you use for travel vids? Zylker collabs karo! Your content is amazing 📹',replyTime:'18 Aug 2026 11:34 AM',engagements:'342 engagements',canEngage:true,activity:[],userInfo:{Platform:'YouTube',Type:'Comment',Channel:'deepakvlog'}},
  {id:'i18',net:'rd',date:'17 Aug 2026',time:'09:22 PM',author:'throwaway_travels',handle:'r/india',avatar:'TH',bg:'#ff4500',snippet:'Has anyone used Zylker Travels for a Europe trip? Honest reviews?',tag:'POST',priority:'High',assignee:'Aswin Kumar',status:'Open',unread:true,convTitle:'throwaway_travels posted in r/india',content:'Has anyone used Zylker Travels for a Europe trip? Planning 12-day trip, got quote of ₹1.8L. Is it legit?',replyTime:'17 Aug 2026 09:22 PM',engagements:'234 upvotes · 67 comments',canEngage:true,activity:[{icon:'blue',text:'Aswin Kumar assigned — high priority review needed',time:'17 Aug 2026 10:00 PM'}],userInfo:{Platform:'Reddit',Type:'Post',Subreddit:'r/india',Upvotes:'234',Comments:'67'}},
  {id:'i19',net:'gl',date:'16 Aug 2026',time:'04:30 PM',author:'Meera Krishnan',handle:'Google Review',avatar:'MK',bg:'#34a853',snippet:'⭐⭐⭐⭐⭐ Exceptional! Our family trip to Coorg was flawless.',tag:'REVIEW',priority:'Low',assignee:'Tsakane Dlamini',status:'Closed',unread:false,convTitle:'Meera Krishnan left a 5-star review',content:'Exceptional service! Our family trip to Coorg was flawless. Hotel was exactly as shown, driver was professional.',replyTime:'16 Aug 2026 04:30 PM',canEngage:true,activity:[{icon:'green',text:'Tsakane Dlamini replied to review',time:'16 Aug 2026 05:00 PM'}],userInfo:{Platform:'Google Business',Type:'Review',Rating:'5 stars',Location:'Bangalore'}},
  {id:'i20',net:'gl',date:'15 Aug 2026',time:'01:15 PM',author:'Karthik S',handle:'Google Review',avatar:'KS',bg:'#ea4335',snippet:'⭐⭐ Hotel was downgraded without notice. Very disappointed.',tag:'REVIEW',priority:'High',assignee:'Vishal Noel',status:'Under Review',unread:true,convTitle:'Karthik S left a 2-star review',content:'⭐⭐ The hotel was downgraded without notice. They promised 4-star but delivered 3-star. Would not recommend.',replyTime:'15 Aug 2026 01:15 PM',canEngage:true,activity:[{icon:'blue',text:'Vishal Noel assigned — urgent response needed',time:'15 Aug 2026 02:00 PM'}],userInfo:{Platform:'Google Business',Type:'Review',Rating:'2 stars',Location:'Hyderabad'}},
  {id:'i21',net:'th',date:'14 Aug 2026',time:'06:30 PM',author:'nithya.world',handle:'@nithya.world',avatar:'NW',bg:'#1a1a2e',snippet:'@ZylkerTravels just booked Bali and I am THRIVING already ✈️',tag:'MENTION',priority:'Low',assignee:'',status:'Open',unread:false,convTitle:'nithya.world mentioned you on Threads',content:'@ZylkerTravels just booked Bali and I am THRIVING already ✈️🌺 Cannot wait for October!',replyTime:'14 Aug 2026 06:30 PM',canEngage:true,activity:[],userInfo:{Platform:'Threads',Type:'Mention',Followers:'2,104',Following:'340'}},
  {id:'i22',net:'x',date:'13 Aug 2026',time:'11:00 AM',author:'RamyaSrinivasan',handle:'@ramya_srinivasan',avatar:'RS',bg:'#7c3aed',snippet:'@ZylkerTravels your Andaman package saved my honeymoon planning! 💕',tag:'MENTION',priority:'Low',assignee:'Sarath R',status:'Closed',unread:false,convTitle:'RamyaSrinivasan mentioned you',content:'@ZylkerTravels your Andaman package saved my honeymoon planning! 💕 Snorkeling was unforgettable!',replyTime:'13 Aug 2026 11:00 AM',canEngage:true,activity:[{icon:'green',text:'Sarath R replied and closed',time:'13 Aug 2026 11:30 AM'}],userInfo:{Platform:'X (Twitter)',Type:'Mention',Followers:'567',Following:'234'}},
  {id:'i23',net:'fb',date:'12 Aug 2026',time:'03:45 PM',author:'Vikram Nair',handle:'Zylker Travels page',avatar:'VN',bg:'#1877f2',snippet:'Your Sri Lanka tour was delayed 2 hours. No communication from your team!',tag:'COMMENT',priority:'High',assignee:'Lisa Clark',status:'Under Review',unread:true,convTitle:'Vikram Nair commented on your post',origPost:'Our Sri Lanka package — misty mountains and golden beaches await! 🏝️',origTime:'10 Aug 2026 09:00 AM',content:'Your Sri Lanka tour was delayed 2 hours. No communication! We had connecting arrangements. I want a partial refund.',replyTime:'12 Aug 2026 03:45 PM',canEngage:true,activity:[{icon:'blue',text:'Lisa Clark assigned — urgent',time:'12 Aug 2026 04:00 PM'}],userInfo:{Platform:'Facebook',Type:'Comment',Location:'Kochi, India'}},
  {id:'i24',net:'ig',date:'11 Aug 2026',time:'09:10 AM',author:'divya_adventures',handle:'@divya_adventures',avatar:'DA',bg:'#f59e0b',snippet:'Following @ZylkerTravels since 2021, content keeps getting better!',tag:'MENTION',priority:'Low',assignee:'',status:'Open',unread:false,convTitle:'divya_adventures mentioned you',content:'Following @ZylkerTravels since 2021 and their content just keeps getting better! ❤️ #TravelInspiration',replyTime:'11 Aug 2026 09:10 AM',canEngage:true,activity:[],userInfo:{Platform:'Instagram',Type:'Mention',Followers:'41,200',Following:'610'}},
  {id:'i25',net:'x',date:'10 Aug 2026',time:'07:55 PM',author:'PrakashGopal',handle:'@prakashgopal_in',avatar:'PG',bg:'#0284c7',snippet:'Is Zylker still running the summer flash sale? Website shows sold out',tag:'REPLY',priority:'Medium',assignee:'Aswin Kumar',status:'Open',unread:true,convTitle:'PrakashGopal replied to your post',origPost:'FLASH SALE: 30% off all packages booked this week! ⚡',origTime:'09 Aug 2026 10:00 AM',content:'Is Zylker Travels still running the summer flash sale? Website shows sold out but I see a booking link?',replyTime:'10 Aug 2026 07:55 PM',canEngage:true,activity:[{icon:'blue',text:'Aswin Kumar assigned',time:'10 Aug 2026 08:30 PM'}],userInfo:{Platform:'X (Twitter)',Type:'Reply',Followers:'1,891',Following:'430'}},
  {id:'i26',net:'yt',date:'09 Aug 2026',time:'05:30 PM',author:'TravelBlogSiddharth',handle:'@siddharth_blogs',avatar:'TB',bg:'#dc2626',snippet:'50k views and still no reply to comments? Come on Zylker!',tag:'COMMENT',priority:'High',assignee:'Tsakane Dlamini',status:'Under Review',unread:true,convTitle:'TravelBlogSiddharth commented on your video',origPost:'BEST OF EUROPE 2026 | 10 Days Budget Travel Guide | Zylker Travels',origTime:'07 Aug 2026 09:00 AM',content:'Your video got 50k views and you still have not replied to any comments? Come on Zylker!',replyTime:'09 Aug 2026 05:30 PM',engagements:'312 engagements',canEngage:true,activity:[{icon:'blue',text:'Tsakane Dlamini assigned — community management',time:'09 Aug 2026 06:00 PM'}],userInfo:{Platform:'YouTube',Type:'Comment',Channel:'siddharth_blogs'}},
  {id:'i27',net:'rd',date:'08 Aug 2026',time:'08:00 AM',author:'curious_backpacker',handle:'r/solotravel',avatar:'CB',bg:'#ff4500',snippet:'Thinking of booking Zylker for Vietnam. Any red flags?',tag:'POST',priority:'Medium',assignee:'Vishal Noel',status:'Open',unread:false,convTitle:'curious_backpacker posted in r/solotravel',content:'Thinking of booking Zylker Travels for a Vietnam solo trip. Budget ₹70K for 8 days. Any red flags?',replyTime:'08 Aug 2026 08:00 AM',engagements:'98 upvotes · 43 comments',canEngage:true,activity:[{icon:'blue',text:'Vishal Noel assigned to respond',time:'08 Aug 2026 09:00 AM'}],userInfo:{Platform:'Reddit',Type:'Post',Subreddit:'r/solotravel',Upvotes:'98',Comments:'43'}},
  {id:'i28',net:'gl',date:'07 Aug 2026',time:'02:45 PM',author:'Suresh Babu',handle:'Google Review',avatar:'SB',bg:'#34a853',snippet:'⭐⭐⭐⭐ Good trip, slight delay in visa but team handled well.',tag:'REVIEW',priority:'Low',assignee:'',status:'Closed',unread:false,convTitle:'Suresh Babu left a 4-star review',content:'⭐⭐⭐⭐ Good trip overall, slight delay in visa processing but team handled professionally. Hotel and transport excellent.',replyTime:'07 Aug 2026 02:45 PM',canEngage:true,activity:[{icon:'green',text:'Auto-replied with thank you message',time:'07 Aug 2026 03:00 PM'}],userInfo:{Platform:'Google Business',Type:'Review',Rating:'4 stars',Location:'Chennai'}},
  {id:'i29',net:'ig',date:'06 Aug 2026',time:'12:30 PM',author:'roaming_renu',handle:'@roaming_renu',avatar:'RR',bg:'#ec4899',snippet:'Just tagged you in my Maldives album! Hope you repost 🤞',tag:'MENTION',priority:'Low',assignee:'',status:'Open',unread:true,convTitle:'roaming_renu tagged you in a post',content:'Just tagged @ZylkerTravels in my Maldives album! They made our honeymoon absolutely perfect! #Maldives #ZylkerTravels',replyTime:'06 Aug 2026 12:30 PM',canEngage:true,activity:[],userInfo:{Platform:'Instagram',Type:'Tag',Followers:'9,840',Following:'720'}},
  {id:'i30',net:'fb',date:'05 Aug 2026',time:'10:20 AM',author:'Anand Krishnamurthy',handle:'Zylker Travels inbox',avatar:'AK',bg:'#0369a1',snippet:'Do you have group discounts for corporate team outings? 30 people.',tag:'DM',priority:'High',assignee:'Lisa Clark',status:'Under Review',unread:true,convTitle:'Anand Krishnamurthy sent you a message',content:'Hi Zylker team, do you have group discounts for corporate team outings? 30 people, budget ~₹25K per head, 3 nights.',replyTime:'05 Aug 2026 10:20 AM',canEngage:true,activity:[{icon:'blue',text:'Lisa Clark assigned — corporate lead',time:'05 Aug 2026 11:00 AM'}],userInfo:{Platform:'Facebook',Type:'Direct Message',Location:'Pune, India'}},
  {id:'i31',net:'x',date:'04 Aug 2026',time:'03:15 PM',author:'deepakvlogger',handle:'@deepakvlogger',avatar:'DV',bg:'#7c3aed',snippet:'@ZylkerTravels Please check your DMs. Group booking request 3 days ago.',tag:'MENTION',priority:'Medium',assignee:'Aswin Kumar',status:'Open',unread:false,convTitle:'deepakvlogger mentioned you',content:'@ZylkerTravels Please check your DMs. Sent a group booking request 3 days ago. No response. Very poor customer support.',replyTime:'04 Aug 2026 03:15 PM',canEngage:true,activity:[{icon:'blue',text:'Aswin Kumar assigned',time:'04 Aug 2026 04:00 PM'}],userInfo:{Platform:'X (Twitter)',Type:'Mention',Followers:'8,920',Following:'340'}},
  {id:'i32',net:'ig',date:'03 Aug 2026',time:'07:45 PM',author:'jetset_kavitha',handle:'@jetset_kavitha',avatar:'JK',bg:'#dc2626',snippet:'Your stories about Kashmir made me cry 😭 planning my trip rn',tag:'COMMENT',priority:'Low',assignee:'',status:'Open',unread:false,convTitle:'jetset_kavitha commented on your post',origPost:'Kashmir — heaven on earth 🏔️ Book our Kashmir Serenity package! #Kashmir',origTime:'02 Aug 2026 09:00 AM',content:'Your stories about Kashmir made me cry 😭 planning my trip rn. Solo trip sahi rahega ya group?',replyTime:'03 Aug 2026 07:45 PM',canEngage:true,activity:[],userInfo:{Platform:'Instagram',Type:'Comment',Followers:'6,230',Following:'890'}},
  {id:'i33',net:'yt',date:'02 Aug 2026',time:'04:10 PM',author:'TravelMateArjun',handle:'@arjun_explores',avatar:'TA',bg:'#10b981',snippet:'Why is Zylker not doing Thailand anymore? Your 2024 video was the best!',tag:'COMMENT',priority:'Low',assignee:'',status:'Open',unread:false,convTitle:'TravelMateArjun commented on your video',origPost:'Top 5 Budget Trips from India 2026 | Zylker Travels',origTime:'01 Aug 2026 10:00 AM',content:'Why is Zylker not doing Thailand anymore? Your 2024 Thailand video was the best! Please bring it back. 🙏',replyTime:'02 Aug 2026 04:10 PM',engagements:'76 engagements',canEngage:true,activity:[],userInfo:{Platform:'YouTube',Type:'Comment',Channel:'arjun_explores'}},
  {id:'i34',net:'fb',date:'01 Aug 2026',time:'09:55 AM',author:'Lakshmi Priya',handle:'Zylker Travels page',avatar:'LP',bg:'#ec4899',snippet:'We are 4 friends planning a girls trip. Options for November?',tag:'COMMENT',priority:'Medium',assignee:'Sarath R',status:'Open',unread:true,convTitle:'Lakshmi Priya commented on your post',origPost:'Girls getaway season is here! From hill stations to beaches. #GirlsTrip',origTime:'30 Jul 2026 10:00 AM',content:'We are 4 friends planning a girls trip. Options for November? Budget around ₹40K per person.',replyTime:'01 Aug 2026 09:55 AM',canEngage:true,activity:[{icon:'blue',text:'Sarath R assigned',time:'01 Aug 2026 10:30 AM'}],userInfo:{Platform:'Facebook',Type:'Comment',Location:'Hyderabad, India'}},
  {id:'i35',net:'th',date:'31 Jul 2026',time:'08:30 PM',author:'aryan.travels',handle:'@aryan.travels',avatar:'AT',bg:'#1a1a2e',snippet:'Zylker Travels is genuinely underrated. Booked 3 trips, all flawless.',tag:'MENTION',priority:'Low',assignee:'',status:'Open',unread:false,convTitle:'aryan.travels mentioned you on Threads',content:'Zylker Travels is genuinely underrated. Booked 3 trips, all flawless. @ZylkerTravels keep doing what you do! 🙌',replyTime:'31 Jul 2026 08:30 PM',canEngage:true,activity:[],userInfo:{Platform:'Threads',Type:'Mention',Followers:'3,400',Following:'280'}},
  {id:'i36',net:'rd',date:'30 Jul 2026',time:'11:45 AM',author:'travelbug_india',handle:'r/IndiaTravelBudget',avatar:'TI',bg:'#ff4500',snippet:'Zylker overcharged me by ₹8000. Anyone else faced this?',tag:'POST',priority:'High',assignee:'Vishal Noel',status:'Under Review',unread:true,convTitle:'travelbug_india posted in r/IndiaTravelBudget',content:'Zylker overcharged me by ₹8000 with hidden "fuel surcharge" and "airport assistance" fees never mentioned. Is it worth fighting?',replyTime:'30 Jul 2026 11:45 AM',engagements:'189 upvotes · 94 comments',canEngage:true,activity:[{icon:'blue',text:'Vishal Noel assigned — legal/escalation',time:'30 Jul 2026 12:30 PM'}],userInfo:{Platform:'Reddit',Type:'Post',Subreddit:'r/IndiaTravelBudget',Upvotes:'189',Comments:'94'}},
  {id:'i37',net:'x',date:'29 Jul 2026',time:'02:00 PM',author:'sunita_nomad',handle:'@sunita_nomad',avatar:'SN',bg:'#0284c7',snippet:'Just made my bucket list shorter thanks to @ZylkerTravels 🎉 Himachal done!',tag:'MENTION',priority:'Low',assignee:'',status:'Open',unread:false,convTitle:'sunita_nomad mentioned you',content:'Just made my bucket list shorter thanks to @ZylkerTravels 🎉 Himachal done! Spiti Valley was breathtaking.',replyTime:'29 Jul 2026 02:00 PM',canEngage:true,activity:[],userInfo:{Platform:'X (Twitter)',Type:'Mention',Followers:'4,120',Following:'560'}},
  {id:'i38',net:'ig',date:'28 Jul 2026',time:'05:15 PM',author:'_travelgram_india',handle:'@_travelgram_india',avatar:'TG',bg:'#6d28d9',snippet:'My highlight reel from Zylker Goa trip is up! Linked packages in bio 🏖️',tag:'MENTION',priority:'Low',assignee:'',status:'Open',unread:false,convTitle:'_travelgram_india mentioned you in a post',content:'My highlight reel from the @ZylkerTravels Goa trip is up! Watch till the end! #Goa #ZylkerTravels',replyTime:'28 Jul 2026 05:15 PM',canEngage:true,activity:[],userInfo:{Platform:'Instagram',Type:'Mention',Followers:'78,200',Following:'1,200'}},
  {id:'i39',net:'yt',date:'27 Jul 2026',time:'01:22 PM',author:'RajeshTravels',handle:'@rjtravels',avatar:'RT',bg:'#dc2626',snippet:'Realtime?? Is Zylker live on YouTube? Someone reply!',tag:'COMMENT',priority:'High',assignee:'Tsakane Dlamini',status:'Open',unread:true,convTitle:'RajeshTravels commented on your live stream',origPost:'LIVE Q&A: Your Travel Questions Answered! | Zylker Travels',origTime:'27 Jul 2026 01:00 PM',content:'Realtime?? Is Zylker live on YouTube? Someone reply!! Been waiting 10 mins 😭',replyTime:'27 Jul 2026 01:22 PM',engagements:'342 engagements',canEngage:true,activity:[{icon:'blue',text:'Tsakane Dlamini assigned for live moderation',time:'27 Jul 2026 01:25 PM'}],userInfo:{Platform:'YouTube',Type:'Live Chat',Channel:'rjtravels'}},
  {id:'i40',net:'fb',date:'26 Jul 2026',time:'10:30 AM',author:'Mohan Raj',handle:'Zylker Travels page',avatar:'MR',bg:'#1877f2',snippet:'Booking portal is down! Trying to confirm payment from yesterday.',tag:'COMMENT',priority:'High',assignee:'Lisa Clark',status:'Under Review',unread:true,convTitle:'Mohan Raj commented on your post',origPost:'Book your dream trip in 3 easy steps! Visit zylkertravels.com',origTime:'25 Jul 2026 09:00 AM',content:'Booking portal is down! ₹45,000 is debited but no confirmation email. Very worried!!',replyTime:'26 Jul 2026 10:30 AM',canEngage:true,activity:[{icon:'blue',text:'Lisa Clark assigned — urgent payment issue',time:'26 Jul 2026 11:00 AM'}],userInfo:{Platform:'Facebook',Type:'Comment',Location:'Chennai, India'}},
  {id:'i41',net:'li',date:'25 Jul 2026',time:'03:00 PM',author:'Arjun Mehta',handle:'LinkedIn',avatar:'AM',bg:'#0a66c2',snippet:'Congratulations on 10K followers! Zylker is transforming how India travels.',tag:'COMMENT',priority:'Low',assignee:'',status:'Open',unread:false,convTitle:'Arjun Mehta commented on your LinkedIn post',origPost:'We have hit 10,000 followers on LinkedIn! ✈️ #ZylkerTravels #Milestone',origTime:'25 Jul 2026 10:00 AM',content:"Congratulations on 10K followers! Zylker Travels is transforming how India travels. Your team's dedication shows!",replyTime:'25 Jul 2026 03:00 PM',canEngage:true,activity:[],userInfo:{Platform:'LinkedIn',Type:'Comment',Connections:'500+',Title:'HR Director',Company:'InfoSys'}},
  {id:'i42',net:'li',date:'24 Jul 2026',time:'11:20 AM',author:'Preethi Nambiar',handle:'LinkedIn',avatar:'PN',bg:'#0a66c2',snippet:'Looking for a reliable travel partner for our annual team retreat.',tag:'DM',priority:'High',assignee:'Vishal Noel',status:'Open',unread:true,convTitle:'Preethi Nambiar sent you a LinkedIn message',content:'Hi Zylker team, looking for a travel partner for our annual retreat (80 people). Can we schedule a call this week?',replyTime:'24 Jul 2026 11:20 AM',canEngage:true,activity:[{icon:'blue',text:'Vishal Noel assigned — enterprise lead',time:'24 Jul 2026 12:00 PM'}],userInfo:{Platform:'LinkedIn',Type:'Direct Message',Connections:'500+',Title:'Operations Manager',Company:'TCS'}},
  {id:'i43',net:'x',date:'23 Jul 2026',time:'09:45 AM',author:'HikeWithHarish',handle:'@hikewithharish',avatar:'HH',bg:'#10b981',snippet:'@ZylkerTravels Kedarnath trek booking live?? Need 4 spots!',tag:'REPLY',priority:'High',assignee:'Aswin Kumar',status:'Open',unread:true,convTitle:'HikeWithHarish replied on your tweet',origPost:'Kedarnath Trek 2026 — Limited spots open! Register now! #Kedarnath',origTime:'22 Jul 2026 08:00 AM',content:'@ZylkerTravels Kedarnath trek booking is live?? Need 4 spots! Please DM me ASAP! 🙏',replyTime:'23 Jul 2026 09:45 AM',canEngage:true,activity:[{icon:'blue',text:'Aswin Kumar assigned — high demand trek',time:'23 Jul 2026 10:00 AM'}],userInfo:{Platform:'X (Twitter)',Type:'Reply',Followers:'2,890',Following:'430'}},
  {id:'i44',net:'ig',date:'22 Jul 2026',time:'04:55 PM',author:'foodie_and_travel',handle:'@foodie_and_travel',avatar:'FT',bg:'#f59e0b',snippet:'Zylker Travels recommended by 3 friends in one week. Must be a sign! 👀',tag:'MENTION',priority:'Low',assignee:'',status:'Open',unread:false,convTitle:'foodie_and_travel mentioned you',content:'@ZylkerTravels recommended by 3 different friends in one week. Must be a sign! 👀 Checking packages now.',replyTime:'22 Jul 2026 04:55 PM',canEngage:true,activity:[],userInfo:{Platform:'Instagram',Type:'Mention',Followers:'23,400',Following:'1,040'}},
  {id:'i45',net:'rd',date:'21 Jul 2026',time:'07:30 PM',author:'expat_in_mumbai',handle:'r/mumbai',avatar:'EM',bg:'#ff4500',snippet:'Zylker Travels Andheri office is amazing. Walked in and got full consultation!',tag:'POST',priority:'Low',assignee:'',status:'Closed',unread:false,convTitle:'expat_in_mumbai posted in r/mumbai',content:'Shoutout to Zylker Travels in Andheri! Walked in without appointment, got 45-min consultation. Got a great Japan tour deal.',replyTime:'21 Jul 2026 07:30 PM',engagements:'67 upvotes · 12 comments',canEngage:true,activity:[{icon:'gray',text:'Marked closed — positive mention',time:'21 Jul 2026 08:00 PM'}],userInfo:{Platform:'Reddit',Type:'Post',Subreddit:'r/mumbai',Upvotes:'67',Comments:'12'}},
  {id:'i46',net:'yt',date:'20 Jul 2026',time:'03:40 PM',author:'BollywoodTraveller',handle:'@bollywood_traveller',avatar:'BT',bg:'#dc2626',snippet:'Bhai aapka New Zealand vlog dekh ke rona aa gaya. Zylker se book kar raha hoon!',tag:'COMMENT',priority:'Low',assignee:'',status:'Open',unread:false,convTitle:'BollywoodTraveller commented on your video',origPost:'New Zealand Road Trip Vlog | Lord of the Rings Country | Zylker Travels',origTime:'18 Jul 2026 10:00 AM',content:'Bhai aapka New Zealand vlog dekh ke rona aa gaya. Zylker se book kar raha hoon! 🥹✈️',replyTime:'20 Jul 2026 03:40 PM',engagements:'94 engagements',canEngage:true,activity:[],userInfo:{Platform:'YouTube',Type:'Comment',Channel:'bollywood_traveller'}},
  {id:'i47',net:'fb',date:'19 Jul 2026',time:'02:30 PM',author:'Sathish Natesan',handle:'Zylker Travels page',avatar:'SN',bg:'#1877f2',snippet:'How do I get a refund? Trip cancelled due to floods and nobody is answering.',tag:'COMMENT',priority:'High',assignee:'Vishal Noel',status:'Under Review',unread:true,convTitle:'Sathish Natesan commented on your post',content:'How do I get a refund? My Coorg trip cancelled due to floods, team not answering calls for 2 days. I paid ₹62,000!',replyTime:'19 Jul 2026 02:30 PM',canEngage:true,activity:[{icon:'blue',text:'Vishal Noel assigned — urgent refund case',time:'19 Jul 2026 03:00 PM'}],userInfo:{Platform:'Facebook',Type:'Comment',Location:'Bangalore, India'}},
  {id:'i48',net:'th',date:'18 Jul 2026',time:'09:20 AM',author:'zara.explores',handle:'@zara.explores',avatar:'ZE',bg:'#1a1a2e',snippet:'Found Zylker and immediately booked Morocco. Dream come true!',tag:'MENTION',priority:'Low',assignee:'',status:'Open',unread:false,convTitle:'zara.explores mentioned you on Threads',content:'Found @ZylkerTravels through a friend and immediately booked Morocco. Dream come true! ✨🌍 #Morocco',replyTime:'18 Jul 2026 09:20 AM',canEngage:true,activity:[],userInfo:{Platform:'Threads',Type:'Mention',Followers:'1,890',Following:'440'}},
  {id:'i49',net:'x',date:'17 Jul 2026',time:'12:45 PM',author:'backpacker_abhi',handle:'@backpacker_abhi',avatar:'BA',bg:'#6d28d9',snippet:'Any hidden charges on the ₹89K Europe package? Please be transparent.',tag:'REPLY',priority:'Medium',assignee:'Sarath R',status:'Open',unread:true,convTitle:'backpacker_abhi replied to your post',origPost:'EUROPE YOUR WAY — 10 days, 5 countries, ₹89,000 all inclusive! 🇪🇺',origTime:'16 Jul 2026 09:00 AM',content:'@ZylkerTravels any hidden charges on the ₹89K Europe package? People say there are extra visa fees. Please be transparent.',replyTime:'17 Jul 2026 12:45 PM',canEngage:true,activity:[{icon:'blue',text:'Sarath R assigned',time:'17 Jul 2026 01:00 PM'}],userInfo:{Platform:'X (Twitter)',Type:'Reply',Followers:'1,230',Following:'380'}},
  {id:'i50',net:'ig',date:'16 Jul 2026',time:'06:20 PM',author:'maldives_dreamer',handle:'@maldives_dreamer',avatar:'MD',bg:'#0284c7',snippet:'My Maldives reel is at 200K views and I keep sending people your way!',tag:'MENTION',priority:'Low',assignee:'Tsakane Dlamini',status:'Open',unread:false,convTitle:'maldives_dreamer mentioned you',content:'@ZylkerTravels my Maldives reel is at 200K views and I keep sending people your way! You deserve more recognition. #Maldives',replyTime:'16 Jul 2026 06:20 PM',canEngage:true,activity:[{icon:'blue',text:'Tsakane Dlamini assigned — influencer collab opportunity',time:'16 Jul 2026 07:00 PM'}],userInfo:{Platform:'Instagram',Type:'Mention',Followers:'192,400',Following:'820'}},
  {id:'i51',net:'gl',date:'15 Jul 2026',time:'11:30 AM',author:'Parvati Venkat',handle:'Google Review',avatar:'PV',bg:'#34a853',snippet:'⭐⭐⭐ Average experience. Guide cancelled last minute.',tag:'REVIEW',priority:'Medium',assignee:'Aswin Kumar',status:'Under Review',unread:true,convTitle:'Parvati Venkat left a 3-star review',content:'⭐⭐⭐ Average experience. Hotel was fine but guide cancelled last minute and replacement was not well-prepared.',replyTime:'15 Jul 2026 11:30 AM',canEngage:true,activity:[{icon:'blue',text:'Aswin Kumar assigned for response',time:'15 Jul 2026 12:00 PM'}],userInfo:{Platform:'Google Business',Type:'Review',Rating:'3 stars',Location:'Mumbai'}},
  {id:'i52',net:'rd',date:'14 Jul 2026',time:'04:15 PM',author:'delhi_wanderer',handle:'r/delhi',avatar:'DW',bg:'#ff4500',snippet:'PSA: Zylker has a Delhi office now! Super convenient for north India.',tag:'POST',priority:'Low',assignee:'',status:'Closed',unread:false,convTitle:'delhi_wanderer posted in r/delhi',content:'PSA: Zylker Travels has a Delhi office now! Staff was helpful. Great north India packages.',replyTime:'14 Jul 2026 04:15 PM',engagements:'124 upvotes · 28 comments',canEngage:true,activity:[{icon:'gray',text:'Marked closed — positive mention',time:'14 Jul 2026 05:00 PM'}],userInfo:{Platform:'Reddit',Type:'Post',Subreddit:'r/delhi',Upvotes:'124',Comments:'28'}},
  {id:'i53',net:'li',date:'13 Jul 2026',time:'09:00 AM',author:'Kavitha Sharma',handle:'LinkedIn',avatar:'KV',bg:'#0a66c2',snippet:'Zylker helped plan our 120-person company offsite. Seamless!',tag:'COMMENT',priority:'Low',assignee:'',status:'Closed',unread:false,convTitle:'Kavitha Sharma commented on LinkedIn',origPost:'Corporate travel reimagined. #CorporateTravel',origTime:'12 Jul 2026 10:00 AM',content:'Zylker Travels helped plan our company offsite for 120 employees. Seamless experience! Highly recommended.',replyTime:'13 Jul 2026 09:00 AM',canEngage:true,activity:[{icon:'green',text:'Auto-thanked. Marked closed.',time:'13 Jul 2026 09:30 AM'}],userInfo:{Platform:'LinkedIn',Type:'Comment',Connections:'500+',Title:'Chief People Officer',Company:'Zoho'}},
  {id:'i54',net:'yt',date:'12 Jul 2026',time:'08:45 PM',author:'Wandering Meena',handle:'@wandering_meena',avatar:'WM',bg:'#6d28d9',snippet:'Which Zylker package includes Kumbh Mela experience?',tag:'COMMENT',priority:'Medium',assignee:'',status:'Open',unread:true,convTitle:'Wandering Meena commented on your video',origPost:'Spiritual India: Top Pilgrimages 2026 | Zylker Travels',origTime:'10 Jul 2026 10:00 AM',content:'Which Zylker package includes Kumbh Mela experience? Cannot find it on the website. Planning for my parents.',replyTime:'12 Jul 2026 08:45 PM',engagements:'45 engagements',canEngage:true,activity:[],userInfo:{Platform:'YouTube',Type:'Comment',Channel:'wandering_meena'}},
  {id:'i55',net:'x',date:'11 Jul 2026',time:'07:30 AM',author:'MumbaiToMadrid',handle:'@mumbaitomadrid',avatar:'MM',bg:'#dc2626',snippet:'@ZylkerTravels Spain trip beyond expectations. 10/10 would book again!',tag:'MENTION',priority:'Low',assignee:'',status:'Open',unread:false,convTitle:'MumbaiToMadrid mentioned you',content:'@ZylkerTravels Spain trip was beyond expectations. 10/10 would book again! Paella in Barcelona hit different when you did not have to plan anything 😄',replyTime:'11 Jul 2026 07:30 AM',canEngage:true,activity:[],userInfo:{Platform:'X (Twitter)',Type:'Mention',Followers:'3,210',Following:'490'}},
  {id:'i56',net:'ig',date:'10 Jul 2026',time:'05:50 PM',author:'travelshots_by_kiran',handle:'@travelshots_by_kiran',avatar:'TK',bg:'#10b981',snippet:'Using my Zylker Maldives shots for my portfolio! Best trip ever 📸',tag:'MENTION',priority:'Low',assignee:'Tsakane Dlamini',status:'Open',unread:false,convTitle:'travelshots_by_kiran mentioned you',content:'Using my @ZylkerTravels Maldives shots for my portfolio! Best trip ever 📸 #Photography #Maldives #ZylkerTravels',replyTime:'10 Jul 2026 05:50 PM',canEngage:true,activity:[{icon:'blue',text:'Tsakane Dlamini assigned — UGC opportunity',time:'10 Jul 2026 06:30 PM'}],userInfo:{Platform:'Instagram',Type:'Mention',Followers:'58,100',Following:'920'}},
];

const DISCOVER = [
  {id:'d1',net:'rd',date:'08 Sep 2026',time:'10:14 AM',author:'RunningFan_travel',handle:'r/india',avatar:'RF',bg:'#ff4500',snippet:'Anyone used a travel agency for Europe recently? Worth it vs DIY?',tag:'POST',type:'Post',priority:'Low',assignee:'',status:'Open',unread:true,engagements:'341 upvotes · 87 comments',sentiment:'Neutral',isQuestion:true,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'RunningFan_travel posted in r/india',content:'Anyone used a travel agency for Europe recently? Planning a 10-day trip and debating between DIY and agency. Is the 15-20% premium actually worth it?',canEngage:true,activity:[],userInfo:{Platform:'Reddit',Type:'Post',Subreddit:'r/india',Upvotes:'341',Comments:'87'}},
  {id:'d2',net:'rd',date:'08 Sep 2026',time:'08:33 AM',author:'SarahLee_nomad',handle:'r/solotravel',avatar:'SL',bg:'#0284c7',snippet:'First solo international trip. Which agency for young women?',tag:'POST',type:'Post',priority:'Low',assignee:'',status:'Open',unread:true,engagements:'218 upvotes · 64 comments',sentiment:'Neutral',isQuestion:true,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'SarahLee_nomad posted in r/solotravel',content:'First solo international trip coming up! Looking for an agency that specializes in solo women travel. Safety and communication are my top priorities. Budget ₹80K for 8 days Southeast Asia.',canEngage:true,activity:[],userInfo:{Platform:'Reddit',Type:'Post',Subreddit:'r/solotravel',Upvotes:'218',Comments:'64'}},
  {id:'d3',net:'rd',date:'07 Sep 2026',time:'09:45 PM',author:'MarathonKing_99',handle:'r/travel',avatar:'MK',bg:'#0891b2',snippet:'Travel agency overcharged me by ₹12K. What are my options?',tag:'POST',type:'Post',priority:'Medium',assignee:'Aswin Kumar',status:'Under Review',unread:false,engagements:'442 upvotes · 201 comments',sentiment:'Negative',isQuestion:true,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'MarathonKing_99 posted in r/travel',content:"Travel agency overcharged me by ₹12K. They added 'administrative fees' that were never disclosed upfront. Agency refuses to refund. Consumer court? Credit card dispute?",canEngage:true,activity:[{icon:'blue',text:'Aswin Kumar assigned — monitor competitor issue',time:'07 Sep 2026 10:30 PM'}],userInfo:{Platform:'Reddit',Type:'Post',Subreddit:'r/travel',Upvotes:'442',Comments:'201'}},
  {id:'d4',net:'x',date:'07 Sep 2026',time:'03:12 PM',author:'FitnessTalk_vibes',handle:'@fitnesstalkvibes',avatar:'FT',bg:'#7c3aed',snippet:'Travel agencies vs booking.com — which is better for Europe? 🤔',tag:'POST',type:'Post',priority:'Low',assignee:'',status:'Open',unread:false,engagements:'48 likes · 22 comments',sentiment:'Neutral',isQuestion:true,engLevel:'Low',matchedSearches:['Competitor opportunities'],convTitle:'FitnessTalk_vibes posted',content:'Travel agencies vs booking.com — which is better for group packages to Europe? 🤔 Planning for 6 people. Someone who has done both please share experience!',canEngage:true,activity:[],userInfo:{Platform:'X (Twitter)',Type:'Post',Followers:'4,210',Following:'890'}},
  {id:'d5',net:'rd',date:'06 Sep 2026',time:'07:20 PM',author:'TrailWalker_2026',handle:'r/IndiaTravelBudget',avatar:'TW',bg:'#b45309',snippet:'MakeMyTrip vs travel agencies — which is cheaper for Maldives?',tag:'POST',type:'Post',priority:'Low',assignee:'',status:'Open',unread:false,engagements:'156 upvotes · 48 comments',sentiment:'Neutral',isQuestion:true,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'TrailWalker_2026 posted',content:'MakeMyTrip vs dedicated travel agencies — which is cheaper for a 5-night Maldives trip? I got ₹1.1L from an agency and ₹98K from MMT but agency includes more.',canEngage:true,activity:[],userInfo:{Platform:'Reddit',Type:'Post',Subreddit:'r/IndiaTravelBudget',Upvotes:'156',Comments:'48'}},
  {id:'d6',net:'ig',date:'06 Sep 2026',time:'11:20 AM',author:'globetrotter_meera',handle:'@globetrotter_meera',avatar:'GM',bg:'#e1306c',snippet:'If you are not using a travel agency for Europe in 2026 you are doing it wrong 😅',tag:'POST',type:'Post',priority:'Low',assignee:'',status:'Open',unread:false,engagements:'2,341 likes · 184 comments',sentiment:'Positive',isQuestion:false,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'globetrotter_meera posted on Instagram',content:'If you are not using a travel agency for Europe in 2026 you are doing it wrong 😅 Just came back from a 12-day trip, zero stress. Worth every rupee! #EuropeTrip #TravelAgency',canEngage:true,activity:[],userInfo:{Platform:'Instagram',Type:'Post',Followers:'124,000',Following:'890'}},
  {id:'d7',net:'yt',date:'05 Sep 2026',time:'02:40 PM',author:'YourTravelMate',handle:'@yourtravelmate',avatar:'YT',bg:'#dc2626',snippet:'We tested 5 Indian travel agencies. Here are the results.',tag:'POST',type:'Post',priority:'High',assignee:'Vishal Noel',status:'Under Review',unread:true,engagements:'18,200 views · 432 comments',sentiment:'Neutral',isQuestion:false,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'YourTravelMate posted on YouTube',content:'We tested 5 Indian travel agencies for a Europe trip (Zylker Travels, Thomas Cook, SOTC, Cox & Kings, MakeMyTrip). Ranking from best to worst in value, communication, and experience.',canEngage:true,activity:[{icon:'blue',text:'Vishal Noel assigned — reputation monitoring',time:'05 Sep 2026 04:00 PM'},{icon:'yellow',text:'Priority set to High',time:'05 Sep 2026 04:00 PM'}],userInfo:{Platform:'YouTube',Type:'Post',Subscribers:'82,000',Views:'18,200'}},
  {id:'d8',net:'x',date:'05 Sep 2026',time:'09:10 AM',author:'VijayKumar_trips',handle:'@vijaykumar_trips',avatar:'VK',bg:'#0369a1',snippet:'Honest question: do travel agencies still make sense in 2026?',tag:'POST',type:'Post',priority:'Low',assignee:'',status:'Open',unread:false,engagements:'89 likes · 54 retweets',sentiment:'Neutral',isQuestion:true,engLevel:'Low',matchedSearches:['Competitor opportunities'],convTitle:'VijayKumar_trips posted',content:'Honest question: do travel agencies still make sense in 2026 when flights and hotels are so easy to book online? Or is the value purely in local knowledge?',canEngage:true,activity:[],userInfo:{Platform:'X (Twitter)',Type:'Post',Followers:'6,780',Following:'1,200'}},
  {id:'d9',net:'rd',date:'04 Sep 2026',time:'06:55 PM',author:'hyderabad_hiker',handle:'r/hyderabad',avatar:'HH',bg:'#ff4500',snippet:'Best travel agencies in Hyderabad for international packages?',tag:'POST',type:'Post',priority:'Medium',assignee:'',status:'Open',unread:false,engagements:'203 upvotes · 71 comments',sentiment:'Neutral',isQuestion:true,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'hyderabad_hiker posted in r/hyderabad',content:'Best travel agencies in Hyderabad for international packages? Looking for genuine recommendations for a Japan trip. Budget ₹1.5L per person.',canEngage:true,activity:[],userInfo:{Platform:'Reddit',Type:'Post',Subreddit:'r/hyderabad',Upvotes:'203',Comments:'71'}},
  {id:'d10',net:'ig',date:'04 Sep 2026',time:'10:30 AM',author:'travelwith_abhilasha',handle:'@travelwith_abhilasha',avatar:'TA',bg:'#6d28d9',snippet:'Tokyo trip planned in 48 hours by a travel agency and it was PERFECT 😭',tag:'COMMENT',type:'Comment',priority:'Low',assignee:'',status:'Open',unread:false,engagements:'4,102 likes',sentiment:'Positive',isQuestion:false,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'travelwith_abhilasha commented on a post',content:"Tokyo trip planned in 48 hours by a travel agency and it was PERFECT. Cherry blossoms, sushi, the works. I am speechless 😭 #Tokyo #TravelAgency",canEngage:false,activity:[],userInfo:{Platform:'Instagram',Type:'Comment',Followers:'38,400',Following:'720'}},
  {id:'d11',net:'rd',date:'03 Sep 2026',time:'08:15 PM',author:'budget_backpacker_b',handle:'r/Frugal',avatar:'BB',bg:'#ff4500',snippet:'Travel agencies mark up packages by 30-40%. Proof inside.',tag:'POST',type:'Post',priority:'High',assignee:'Aswin Kumar',status:'Open',unread:true,engagements:'567 upvotes · 243 comments',sentiment:'Negative',isQuestion:false,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'budget_backpacker_b posted in r/Frugal',content:"I broke down a ₹1.2L Europe package from a major Indian travel agency — marking up hotels by 35%, flights by 22%, and adding fake 'coordination fees'. Always get itemized quotes.",canEngage:true,activity:[{icon:'blue',text:'Aswin Kumar flagged — industry credibility issue',time:'03 Sep 2026 09:00 PM'}],userInfo:{Platform:'Reddit',Type:'Post',Subreddit:'r/Frugal',Upvotes:'567',Comments:'243'}},
  {id:'d12',net:'x',date:'03 Sep 2026',time:'02:30 PM',author:'NomadNarayan',handle:'@nomadnarayan',avatar:'NN',bg:'#10b981',snippet:'Worst customer service with a travel agency. 4 emails. Zero response. 🚩',tag:'POST',type:'Post',priority:'Medium',assignee:'',status:'Open',unread:false,engagements:'212 likes · 67 retweets',sentiment:'Negative',isQuestion:false,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'NomadNarayan posted',content:'Worst customer service experience with a major travel agency. Sent 4 emails over 2 weeks. Zero response. Called 3 times, always on hold. Not acceptable for a ₹90K booking.',canEngage:true,activity:[],userInfo:{Platform:'X (Twitter)',Type:'Post',Followers:'9,100',Following:'1,340'}},
  {id:'d13',net:'ig',date:'02 Sep 2026',time:'07:45 PM',author:'insta_itinerary',handle:'@insta_itinerary',avatar:'II',bg:'#e1306c',snippet:'Why I stopped booking with big agencies and switched to boutique planners',tag:'POST',type:'Post',priority:'Low',assignee:'',status:'Open',unread:false,engagements:'1,892 likes · 94 comments',sentiment:'Neutral',isQuestion:false,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'insta_itinerary posted on Instagram',content:"Why I stopped booking with big agencies and switched to boutique travel planners. They know destinations personally, pricing is transparent, and you actually talk to humans. #TravelTips",canEngage:true,activity:[],userInfo:{Platform:'Instagram',Type:'Post',Followers:'87,200',Following:'1,100'}},
  {id:'d14',net:'rd',date:'02 Sep 2026',time:'11:00 AM',author:'weekend_getaways',handle:'r/weekendgetaway',avatar:'WG',bg:'#ff4500',snippet:'Comparison: Booked same Europe trip through agency vs self. Agency won.',tag:'POST',type:'Post',priority:'Low',assignee:'',status:'Open',unread:false,engagements:'287 upvotes · 62 comments',sentiment:'Positive',isQuestion:false,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'weekend_getaways posted',content:'Did an experiment. Booked the same 10-day Europe trip DIY once and through an agency once. Despite paying ₹18K more with the agency, it was 100x less stressful and hotel quality was better.',canEngage:true,activity:[],userInfo:{Platform:'Reddit',Type:'Post',Subreddit:'r/weekendgetaway',Upvotes:'287',Comments:'62'}},
  {id:'d15',net:'x',date:'01 Sep 2026',time:'04:50 PM',author:'PlanMyTrip_India',handle:'@planmytrip_in',avatar:'PM',bg:'#b45309',snippet:'Which agency has the best Visa support for Schengen?',tag:'POST',type:'Post',priority:'Medium',assignee:'',status:'Open',unread:true,engagements:'134 likes · 47 retweets',sentiment:'Neutral',isQuestion:true,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'PlanMyTrip_India posted',content:"Which travel agency has the best Visa support for Schengen? Asking for a friend who was recently rejected. Looking for agencies with strong track record in Schengen visa documentation.",canEngage:true,activity:[],userInfo:{Platform:'X (Twitter)',Type:'Post',Followers:'12,400',Following:'2,100'}},
  {id:'d16',net:'yt',date:'31 Aug 2026',time:'03:20 PM',author:'TripAdvisor_Kumar',handle:'@tripadvisor_kumar',avatar:'TK',bg:'#dc2626',snippet:'How to spot a fraudulent travel agency in India [WATCH]',tag:'POST',type:'Post',priority:'High',assignee:'Vishal Noel',status:'Open',unread:true,engagements:'34,000 views · 890 comments',sentiment:'Negative',isQuestion:false,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'TripAdvisor_Kumar posted on YouTube',content:'How to spot a fraudulent travel agency in India. 7 red flags every traveller must know. Includes fake reviews, advance payment traps, and bait-and-switch hotel tactics.',canEngage:false,activity:[{icon:'blue',text:'Vishal Noel flagged — industry trust issue',time:'31 Aug 2026 05:00 PM'}],userInfo:{Platform:'YouTube',Type:'Post',Subscribers:'156,000',Views:'34,000'}},
  {id:'d17',net:'ig',date:'30 Aug 2026',time:'09:45 AM',author:'DestinationVarun',handle:'@destinationvarun',avatar:'DV',bg:'#0284c7',snippet:'Family trip to Singapore. 5 people, 6 nights, ₹3.5L — was it worth it?',tag:'POST',type:'Post',priority:'Low',assignee:'',status:'Open',unread:false,engagements:'3,200 likes · 178 comments',sentiment:'Positive',isQuestion:false,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'DestinationVarun posted on Instagram',content:'Family trip to Singapore. 5 people, 6 nights, ₹3.5L total booked through a travel agency — was it worth it? YES. Everything from airport pickup to Universal Studios was handled. 😂 #Singapore',canEngage:true,activity:[],userInfo:{Platform:'Instagram',Type:'Post',Followers:'44,100',Following:'1,050'}},
  {id:'d18',net:'rd',date:'29 Aug 2026',time:'07:30 PM',author:'trip_watchdog',handle:'r/consumer',avatar:'TW',bg:'#ff4500',snippet:'Travel agency refused refund during medical emergency. Legal options?',tag:'POST',type:'Post',priority:'High',assignee:'Lisa Clark',status:'Under Review',unread:true,engagements:'489 upvotes · 214 comments',sentiment:'Negative',isQuestion:true,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'trip_watchdog posted in r/consumer',content:'Father had a medical emergency before our Bali trip. Agency refusing to refund ₹1.4L saying dates have passed. Hospital records exist. Any legal options?',canEngage:true,activity:[{icon:'blue',text:'Lisa Clark assigned — legal/brand sensitivity',time:'29 Aug 2026 09:00 PM'}],userInfo:{Platform:'Reddit',Type:'Post',Subreddit:'r/consumer',Upvotes:'489',Comments:'214'}},
  {id:'d19',net:'x',date:'28 Aug 2026',time:'12:15 PM',author:'traveldeals_ananya',handle:'@traveldeals_ananya',avatar:'TA',bg:'#ec4899',snippet:'Onam special: 4 travel agencies compared on Kerala packages 🧵',tag:'POST',type:'Post',priority:'Medium',assignee:'',status:'Open',unread:false,engagements:'342 likes · 89 retweets',sentiment:'Neutral',isQuestion:false,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'traveldeals_ananya posted',content:'Onam special: I compared 4 travel agencies on Kerala packages (4 nights, 2 adults). Price, inclusions, communication speed, and reviews. Full thread below 🧵 #Kerala #Onam',canEngage:true,activity:[],userInfo:{Platform:'X (Twitter)',Type:'Post',Followers:'18,700',Following:'2,340'}},
  {id:'d20',net:'ig',date:'27 Aug 2026',time:'05:30 PM',author:'wanderlust_kiran',handle:'@wanderlust_kiran',avatar:'WK',bg:'#10b981',snippet:'3 years, 14 countries, always booked through agencies. AMA 🌍',tag:'POST',type:'Post',priority:'Low',assignee:'',status:'Open',unread:false,engagements:'5,602 likes · 312 comments',sentiment:'Positive',isQuestion:false,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'wanderlust_kiran posted on Instagram',content:'3 years, 14 countries, always booked through travel agencies. AMA 🌍 Saved me countless hours and money in some cases. Happy to share what to look for!',canEngage:true,activity:[],userInfo:{Platform:'Instagram',Type:'Post',Followers:'231,000',Following:'1,400'}},
  {id:'d21',net:'fb',date:'19 Aug 2026',time:'09:19 PM',author:'Girish P',handle:'Travel & Tourism India Group',avatar:'GP',bg:'#1877f2',snippet:'Hi Zylker, which package for family of 4 to Europe?',tag:'POST',type:'Post',priority:'Medium',assignee:'Lisa Clark',status:'Closed',unread:false,engagements:'214 engagements',sentiment:'Neutral',isQuestion:true,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'Girish P posted in Travel & Tourism India Group',content:'Hi Zylker, which package do you recommend for a family of 4 (2 adults, 2 kids aged 8 and 12) to Europe? Budget around ₹6L total. We prefer child-friendly itineraries.',canEngage:true,activity:[{icon:'green',text:'Lisa Clark replied and closed',time:'19 Aug 2026 10:00 PM'}],userInfo:{Platform:'Facebook',Type:'Post',Group:'Travel & Tourism India Group',Members:'142,000'}},
  {id:'d22',net:'rd',date:'18 Aug 2026',time:'08:30 PM',author:'Chennai_backpacker',handle:'r/Chennai',avatar:'CB',bg:'#ff4500',snippet:'Good travel agencies in Chennai with physical office?',tag:'POST',type:'Post',priority:'Low',assignee:'',status:'Open',unread:false,engagements:'89 upvotes · 31 comments',sentiment:'Neutral',isQuestion:true,engLevel:'Low',matchedSearches:['Competitor opportunities'],convTitle:'Chennai_backpacker posted in r/Chennai',content:'Looking for travel agencies with a physical Chennai office for international packages. Need face-to-face consultation. Budget ₹1.2L for 2 weeks Europe, 2 adults.',canEngage:true,activity:[],userInfo:{Platform:'Reddit',Type:'Post',Subreddit:'r/Chennai',Upvotes:'89',Comments:'31'}},
  {id:'d23',net:'ig',date:'25 Aug 2026',time:'03:15 PM',author:'couples_who_wander',handle:'@couples_who_wander',avatar:'CW',bg:'#ec4899',snippet:'Honeymoon tip: use a travel agency. Worth the 10% premium 💍',tag:'POST',type:'Post',priority:'Low',assignee:'',status:'Open',unread:false,engagements:'6,810 likes · 244 comments',sentiment:'Positive',isQuestion:false,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'couples_who_wander posted on Instagram',content:'Honeymoon planning tip: use a travel agency. Worth the 10% premium 💍 They handle surprises you did not plan for. Our Maldives honeymoon had a room upgrade and private dinner. #Honeymoon',canEngage:true,activity:[],userInfo:{Platform:'Instagram',Type:'Post',Followers:'183,000',Following:'2,100'}},
  {id:'d24',net:'yt',date:'24 Aug 2026',time:'11:00 AM',author:'TravelWithPriya',handle:'@travelwithpriya',avatar:'TP',bg:'#dc2626',snippet:"I paid a travel agency ₹95K for Dubai. Here's what I got [Honest Review]",tag:'POST',type:'Post',priority:'Medium',assignee:'Tsakane Dlamini',status:'Open',unread:false,engagements:'29,400 views · 611 comments',sentiment:'Neutral',isQuestion:false,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'TravelWithPriya posted on YouTube',content:"I paid a travel agency ₹95K for a 5-night Dubai trip for 2 people. Full honest review of what was included, what was not, and whether I would use an agency again. [Not sponsored]",canEngage:true,activity:[{icon:'blue',text:'Tsakane Dlamini assigned — competitor comparison content',time:'24 Aug 2026 01:00 PM'}],userInfo:{Platform:'YouTube',Type:'Post',Subscribers:'92,000',Views:'29,400'}},
  {id:'d25',net:'x',date:'21 Aug 2026',time:'06:15 PM',author:'Mumbai_traveller_ak',handle:'@mumbai_traveller_ak',avatar:'MT',bg:'#0284c7',snippet:'Frustrated with travel agencies? What to always ask before paying.',tag:'POST',type:'Post',priority:'Low',assignee:'',status:'Open',unread:false,engagements:'156 likes · 82 retweets',sentiment:'Neutral',isQuestion:false,engLevel:'Low',matchedSearches:['Competitor opportunities'],convTitle:'Mumbai_traveller_ak posted',content:'Frustrated with travel agencies? What to ALWAYS ask: 1. Full itemized quote 2. Cancellation policy in writing 3. 24/7 support contact 4. Customer reviews not on their own site 5. Are they IATA registered?',canEngage:true,activity:[],userInfo:{Platform:'X (Twitter)',Type:'Post',Followers:'7,200',Following:'1,100'}},
  {id:'d26',net:'fb',date:'11 Aug 2026',time:'02:10 PM',author:'Rekha M',handle:'Solo Travellers India Group',avatar:'RM',bg:'#1877f2',snippet:'Can any agency help me plan a Kerala solo trip? Budget ₹35K.',tag:'POST',type:'Post',priority:'Medium',assignee:'Sarath R',status:'Open',unread:true,engagements:'89 engagements',sentiment:'Neutral',isQuestion:true,engLevel:'Low',matchedSearches:['Competitor opportunities'],convTitle:'Rekha M posted in Solo Travellers India Group',content:'Can any agency help me plan a Kerala solo trip for next month? Budget ₹35K for 5 nights. First time solo. Need someone who will hold my hand a little!',canEngage:true,activity:[{icon:'blue',text:'Sarath R assigned — lead opportunity',time:'11 Aug 2026 03:00 PM'}],userInfo:{Platform:'Facebook',Type:'Post',Group:'Solo Travellers India Group',Members:'87,000'}},
  {id:'d27',net:'ig',date:'09 Aug 2026',time:'10:20 AM',author:'millennials_who_travel',handle:'@millennials_who_travel',avatar:'MW',bg:'#6d28d9',snippet:'Gen Z vs Millennial travel agency use. The data surprised me 📊',tag:'POST',type:'Post',priority:'Low',assignee:'',status:'Open',unread:false,engagements:'4,890 likes · 312 comments',sentiment:'Neutral',isQuestion:false,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'millennials_who_travel posted on Instagram',content:'Gen Z vs Millennial travel agency use. Gen Z is actually MORE likely to use agencies for international travel despite being digital natives. The reason: they value experience over control.',canEngage:true,activity:[],userInfo:{Platform:'Instagram',Type:'Post',Followers:'154,000',Following:'2,100'}},
  {id:'d28',net:'x',date:'08 Aug 2026',time:'03:30 PM',author:'travel_fails_india',handle:'@travel_fails_india',avatar:'TF',bg:'#ef4444',snippet:'Paid ₹2L to an agency. Confirmation received. Hotel was never booked. 🧵',tag:'POST',type:'Post',priority:'High',assignee:'Vishal Noel',status:'Open',unread:true,engagements:'2,312 likes · 891 retweets',sentiment:'Negative',isQuestion:false,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'travel_fails_india posted',content:'HORROR STORY: Paid ₹2L to an agency for a 10-day Europe trip. Got full confirmation, hotel vouchers, everything. Reached Paris — hotel said reservation was never made. Spent night 1 at the airport.',canEngage:true,activity:[{icon:'blue',text:'Vishal Noel flagged — industry trust crisis',time:'08 Aug 2026 05:00 PM'}],userInfo:{Platform:'X (Twitter)',Type:'Post',Followers:'89,000',Following:'3,200'}},
  {id:'d29',net:'rd',date:'07 Aug 2026',time:'07:10 PM',author:'Pune_adventure_club',handle:'r/pune',avatar:'PA',bg:'#ff4500',snippet:'Pune-based agencies for adventure trips? Trekking, rafting, etc.',tag:'POST',type:'Post',priority:'Low',assignee:'',status:'Open',unread:false,engagements:'134 upvotes · 44 comments',sentiment:'Neutral',isQuestion:true,engLevel:'Low',matchedSearches:['Competitor opportunities'],convTitle:'Pune_adventure_club posted in r/pune',content:'Pune-based travel agencies for adventure trips? Looking for trekking to Himalayas or river rafting in Rishikesh. Prefer agencies that know adventure travel, not just regular packages.',canEngage:true,activity:[],userInfo:{Platform:'Reddit',Type:'Post',Subreddit:'r/pune',Upvotes:'134',Comments:'44'}},
  {id:'d30',net:'ig',date:'06 Aug 2026',time:'12:00 PM',author:'digital_nomad_neha',handle:'@digital_nomad_neha',avatar:'DN',bg:'#10b981',snippet:'Digital nomads: do you use travel agencies? I switched. Game changer.',tag:'POST',type:'Post',priority:'Low',assignee:'',status:'Open',unread:false,engagements:'6,200 likes · 380 comments',sentiment:'Positive',isQuestion:false,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'digital_nomad_neha posted on Instagram',content:'Digital nomads: do you use travel agencies? I resisted for 3 years but finally switched for complex multi-country trips. Game changer. My time is now for work, not logistics. #DigitalNomad',canEngage:true,activity:[],userInfo:{Platform:'Instagram',Type:'Post',Followers:'198,000',Following:'2,800'}},
  {id:'d31',net:'fb',date:'04 Aug 2026',time:'09:45 AM',author:'Ramesh Kumar',handle:'India Travel Community',avatar:'RK',bg:'#1877f2',snippet:'Best time to book with a travel agency for December holidays?',tag:'POST',type:'Post',priority:'Low',assignee:'',status:'Open',unread:false,engagements:'167 engagements',sentiment:'Neutral',isQuestion:true,engLevel:'Low',matchedSearches:['Competitor opportunities'],convTitle:'Ramesh Kumar posted in India Travel Community',content:'What is the best time to book with a travel agency for December holidays? Planning Christmas-New Year week. Should I book now (August) or wait for last-minute deals?',canEngage:true,activity:[],userInfo:{Platform:'Facebook',Type:'Post',Group:'India Travel Community',Members:'234,000'}},
  {id:'d32',net:'rd',date:'03 Aug 2026',time:'05:20 PM',author:'bangalore_bride',handle:'r/IndianWeddings',avatar:'BB2',bg:'#ff4500',snippet:'Honeymoon package quotes from 5 agencies. Sharing comparison.',tag:'POST',type:'Post',priority:'Medium',assignee:'Sarath R',status:'Open',unread:true,engagements:'567 upvotes · 234 comments',sentiment:'Neutral',isQuestion:false,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'bangalore_bride posted in r/IndianWeddings',content:'Just got quotes from 5 travel agencies for our Maldives honeymoon (7 nights). Price range was ₹1.2L to ₹2.8L for the same resort! Quality of communication also varied wildly.',canEngage:true,activity:[{icon:'blue',text:'Sarath R assigned — honeymoon lead',time:'03 Aug 2026 06:00 PM'}],userInfo:{Platform:'Reddit',Type:'Post',Subreddit:'r/IndianWeddings',Upvotes:'567',Comments:'234'}},
  {id:'d33',net:'ig',date:'02 Aug 2026',time:'08:15 PM',author:'tripplanner_sahil',handle:'@tripplanner_sahil',avatar:'TS',bg:'#0284c7',snippet:'5 questions to ask before handing money to ANY travel agency 💰',tag:'POST',type:'Post',priority:'Low',assignee:'',status:'Open',unread:false,engagements:'9,800 likes · 540 comments',sentiment:'Neutral',isQuestion:false,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'tripplanner_sahil posted on Instagram',content:'5 questions to ask before handing money to ANY travel agency 💰 1. IATA certified? 2. Escrow account? 3. Refund policy in writing? 4. Can I speak to past clients? 5. 24/7 emergency contact? Save this!',canEngage:true,activity:[],userInfo:{Platform:'Instagram',Type:'Post',Followers:'421,000',Following:'3,100'}},
  {id:'d34',net:'x',date:'01 Aug 2026',time:'01:45 PM',author:'frequent_flyer_fiona',handle:'@ff_fiona',avatar:'FF',bg:'#b45309',snippet:'Platinum frequent flyer here. Still uses a travel agency. Here is my reasoning.',tag:'POST',type:'Post',priority:'Low',assignee:'',status:'Open',unread:false,engagements:'412 likes · 158 retweets',sentiment:'Positive',isQuestion:false,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'frequent_flyer_fiona posted',content:'Platinum frequent flyer here. I have 2.4M miles and still use a travel agency for complex itineraries. My hourly rate at work exceeds the agency fee. The maths always wins.',canEngage:true,activity:[],userInfo:{Platform:'X (Twitter)',Type:'Post',Followers:'14,200',Following:'1,890'}},
  {id:'d35',net:'rd',date:'31 Jul 2026',time:'10:00 PM',author:'first_time_abroad',handle:'r/india',avatar:'FA',bg:'#ff4500',snippet:'First time going abroad. Do I NEED a travel agency or can I manage alone?',tag:'POST',type:'Post',priority:'Medium',assignee:'',status:'Open',unread:true,engagements:'489 upvotes · 201 comments',sentiment:'Neutral',isQuestion:true,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'first_time_abroad posted in r/india',content:'First time going abroad (to Thailand) at 26. Do I NEED a travel agency or can I manage on my own? Not great at planning and visa process confuses me. 8 days, budget ₹60K.',canEngage:true,activity:[],userInfo:{Platform:'Reddit',Type:'Post',Subreddit:'r/india',Upvotes:'489',Comments:'201'}},
  {id:'d36',net:'ig',date:'30 Jul 2026',time:'06:40 PM',author:'travel_startup_watch',handle:'@travel_startup_watch',avatar:'TW2',bg:'#7c3aed',snippet:'Travel agencies in India growing 40% YoY despite OTAs. Here is why 📈',tag:'POST',type:'Post',priority:'Low',assignee:'',status:'Open',unread:false,engagements:'2,890 likes · 178 comments',sentiment:'Positive',isQuestion:false,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'travel_startup_watch posted on Instagram',content:'Travel agencies in India growing 40% YoY despite OTAs. Why? Custom packages, post-COVID travel anxiety, and the Tier 2 city travel boom. Full analysis in bio. #TravelIndustry',canEngage:true,activity:[],userInfo:{Platform:'Instagram',Type:'Post',Followers:'89,200',Following:'1,400'}},
  {id:'d37',net:'fb',date:'29 Jul 2026',time:'03:30 PM',author:'Sundaresh P',handle:'Travel & Tourism India Group',avatar:'SP',bg:'#1877f2',snippet:'Any agency for custom 3-week Japan itinerary for vegetarian family?',tag:'POST',type:'Post',priority:'Medium',assignee:'',status:'Open',unread:false,engagements:'134 engagements',sentiment:'Neutral',isQuestion:true,engLevel:'Low',matchedSearches:['Competitor opportunities'],convTitle:'Sundaresh P posted in Travel & Tourism India Group',content:'Any agency that can do a custom 3-week Japan itinerary for a strict vegetarian family (4 people)? Japan is notoriously difficult for vegetarians. We need an agency that knows the terrain.',canEngage:true,activity:[],userInfo:{Platform:'Facebook',Type:'Post',Group:'Travel & Tourism India Group',Members:'142,000'}},
  {id:'d38',net:'yt',date:'28 Jul 2026',time:'12:45 PM',author:'AutomationPro_Travel',handle:'@autopro_travel',avatar:'AP',bg:'#dc2626',snippet:'I asked AI to plan my Europe trip. Then I asked a travel agency. Who did better?',tag:'POST',type:'Post',priority:'Medium',assignee:'Aswin Kumar',status:'Open',unread:true,engagements:'78,000 views · 2,340 comments',sentiment:'Neutral',isQuestion:false,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'AutomationPro_Travel posted on YouTube',content:'I asked AI (ChatGPT + Claude) to plan my 10-day Europe trip. Then I gave the same brief to 3 travel agencies. Who did better? The results were closer than I expected.',canEngage:true,activity:[{icon:'blue',text:'Aswin Kumar assigned — high-visibility content',time:'28 Jul 2026 02:00 PM'}],userInfo:{Platform:'YouTube',Type:'Post',Subscribers:'428,000',Views:'78,000'}},
  {id:'d39',net:'rd',date:'27 Jul 2026',time:'08:20 PM',author:'small_town_traveller',handle:'r/india',avatar:'ST',bg:'#ff4500',snippet:'From Tier 3 city. No local travel agency. How to find a trustworthy online one?',tag:'POST',type:'Post',priority:'Medium',assignee:'',status:'Open',unread:false,engagements:'267 upvotes · 98 comments',sentiment:'Neutral',isQuestion:true,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'small_town_traveller posted in r/india',content:'I am from a Tier 3 city in UP. There is no reliable local travel agency here. How do I find and verify an online travel agency? Want to book Dubai trip and not get scammed. Budget ₹1.5L for 2.',canEngage:true,activity:[],userInfo:{Platform:'Reddit',Type:'Post',Subreddit:'r/india',Upvotes:'267',Comments:'98'}},
  {id:'d40',net:'ig',date:'26 Jul 2026',time:'05:00 PM',author:'luxury_escapades_india',handle:'@luxury_escapades_india',avatar:'LE',bg:'#9333ea',snippet:'₹10L travel budget. Luxury agency or just premium apps?',tag:'POST',type:'Post',priority:'Low',assignee:'',status:'Open',unread:false,engagements:'4,120 likes · 290 comments',sentiment:'Neutral',isQuestion:true,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'luxury_escapades_india posted on Instagram',content:'₹10L travel budget for 2 adults, 2 weeks Europe. Should I use a luxury travel agency or just premium apps like Amex Travel? The experience difference matters to me.',canEngage:true,activity:[],userInfo:{Platform:'Instagram',Type:'Post',Followers:'78,900',Following:'1,200'}},
  {id:'d41',net:'x',date:'25 Jul 2026',time:'11:30 AM',author:'CorporateNomad_Raj',handle:'@corporatenomad_raj',avatar:'CN',bg:'#0369a1',snippet:'Business travel + leisure combo. Any agencies that handle both well?',tag:'POST',type:'Post',priority:'Low',assignee:'',status:'Open',unread:false,engagements:'89 likes · 34 comments',sentiment:'Neutral',isQuestion:true,engLevel:'Low',matchedSearches:['Competitor opportunities'],convTitle:'CorporateNomad_Raj posted',content:'Business travel + leisure combo. Any agencies that handle both well? 4 days meetings in Singapore, want to extend 5 days leisure. Need corporate billing for meetings and personal billing for leisure.',canEngage:true,activity:[],userInfo:{Platform:'X (Twitter)',Type:'Post',Followers:'3,400',Following:'560'}},
  {id:'d42',net:'rd',date:'24 Jul 2026',time:'09:45 PM',author:'coast_to_coast_travels',handle:'r/travel',avatar:'CC',bg:'#ff4500',snippet:'Which agencies allow true customization vs pre-packaged tours?',tag:'POST',type:'Post',priority:'Medium',assignee:'Sarath R',status:'Open',unread:true,engagements:'345 upvotes · 123 comments',sentiment:'Neutral',isQuestion:true,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'coast_to_coast_travels posted in r/travel',content:'Which Indian travel agencies allow true customization vs just selling pre-packaged tours with no flexibility? I want to go to Peru but none of the packages seem right.',canEngage:true,activity:[{icon:'blue',text:'Sarath R assigned — strong lead',time:'24 Jul 2026 11:00 PM'}],userInfo:{Platform:'Reddit',Type:'Post',Subreddit:'r/travel',Upvotes:'345',Comments:'123'}},
  {id:'d43',net:'ig',date:'23 Jul 2026',time:'04:15 PM',author:'eco_travel_india',handle:'@eco_travel_india',avatar:'ET',bg:'#059669',snippet:'Sustainable travel agencies in India — do they exist?',tag:'POST',type:'Post',priority:'Low',assignee:'',status:'Open',unread:false,engagements:'3,490 likes · 198 comments',sentiment:'Neutral',isQuestion:false,engLevel:'High',matchedSearches:['Competitor opportunities'],convTitle:'eco_travel_india posted on Instagram',content:'Sustainable travel agencies in India — do they actually exist? I spent 3 weeks researching. Here are the ones that actually walk the talk vs just greenwashing. #SustainableTravel',canEngage:true,activity:[],userInfo:{Platform:'Instagram',Type:'Post',Followers:'94,100',Following:'2,400'}},
  {id:'d44',net:'fb',date:'22 Jul 2026',time:'01:00 PM',author:'Kavya Sharma',handle:'Solo Travellers India Group',avatar:'KS2',bg:'#1877f2',snippet:'Did anyone use a travel agency for their first solo international trip?',tag:'POST',type:'Post',priority:'Medium',assignee:'',status:'Open',unread:false,engagements:'312 engagements',sentiment:'Neutral',isQuestion:true,engLevel:'Low',matchedSearches:['Competitor opportunities'],convTitle:'Kavya Sharma posted in Solo Travellers India Group',content:'Did anyone use a travel agency for their first solo international trip? Looking for honest pros and cons. Considering one for South Korea but feel like I might be able to do it myself.',canEngage:true,activity:[],userInfo:{Platform:'Facebook',Type:'Post',Group:'Solo Travellers India Group',Members:'87,000'}},
];

const SEARCHES_ENGAGING = [
  {id:'es1',label:'Reebok complaints',enabled:true},
  {id:'es2',label:'Walking shoe recommendations',enabled:true},
  {id:'es3',label:'Competitor opportunities',enabled:true},
  {id:'es4',label:'Dubai package inquiries',enabled:false},
  {id:'es5',label:'Europe group bookings',enabled:false},
];
const SEARCHES_LISTENING = [
  {id:'lt1',label:'Adidas Brand Health',enabled:false},
  {id:'lt2',label:'Footwear competitors',enabled:false},
  {id:'lt3',label:'Running shoe discussions',enabled:false},
];

/* ─── SMALL HELPERS ─────────────────────────────────── */
const NETS_ALL = ['fb','x','li','ig','yt','tt','rd','th','gl'];
const NETWORKS_INT = [
  {id:'all',label:'ALL',style:{background:'#1f2937',color:'#fff',borderRadius:14,padding:'0 10px',width:'auto',fontSize:12}},
  {id:'fb',sym:'f',bg:'#1877f2'},{id:'x',sym:'𝕏',bg:'#000'},{id:'li',sym:'in',bg:'#0a66c2',fs:9},
  {id:'ig',sym:'◎',bg:'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)'},{id:'yt',sym:'▶',bg:'#ff0000'},
  {id:'tt',sym:'♪',bg:'#000'},{id:'rd',sym:'●',bg:'#ff4500'},{id:'th',sym:'@',bg:'#1a1a2e'},{id:'gl',sym:'G',bg:'#34a853',fs:9},
];
const NETWORKS_DISC = [
  {id:'all',label:'ALL',style:{background:'#1f2937',color:'#fff',borderRadius:14,padding:'0 10px',width:'auto',fontSize:12}},
  {id:'fb',sym:'f',bg:'#1877f2'},{id:'x',sym:'𝕏',bg:'#000'},{id:'ig',sym:'◎',bg:'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)'},
  {id:'yt',sym:'▶',bg:'#ff0000'},{id:'rd',sym:'●',bg:'#ff4500'},{id:'th',sym:'@',bg:'#1a1a2e'},
];

function priColor(p){return p==='High'?'#ef4444':p==='Medium'?'#f59e0b':'#10b981';}
function sentColor(s){return s==='Positive'?{bg:'#f0fdf4',c:'#166534',bc:'#bbf7d0'}:s==='Negative'?{bg:'#fef2f2',c:'#991b1b',bc:'#fecaca'}:{bg:'#f9fafb',c:'#6b7280',bc:'#e5e7eb'};}
function sentIcon(s){return s==='Positive'?'😊':s==='Negative'?'😠':'😐';}
function statusStyle(s){
  if(s==='Open') return {color:'#1d4ed8',borderColor:'#bfdbfe',background:'#eff6ff'};
  if(s==='Under Review') return {color:'#92400e',borderColor:'#fde68a',background:'#fffbeb'};
  return {color:'#374151',borderColor:'#e5e7eb',background:'#f9fafb'};
}
function actIcon(icon){
  return {blue:'#3b82f6',green:'#10b981',gray:'#9ca3af',yellow:'#f59e0b',red:'#ef4444'}[icon]||'#9ca3af';
}
function fmtNow(){
  const d=new Date(), months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let h=d.getHours(),m=String(d.getMinutes()).padStart(2,'0'),ampm=h>=12?'PM':'AM';
  h=h%12||12;
  return `${String(d.getDate()).padStart(2,'0')} ${months[d.getMonth()]} ${d.getFullYear()} ${String(h).padStart(2,'0')}:${m} ${ampm}`;
}

/* ─── SUB-COMPONENTS ────────────────────────────────── */
function NetDot({net}){
  return <span style={{width:13,height:13,borderRadius:'50%',background:NET_BG[net]||'#888',color:'#fff',fontSize:7,fontWeight:700,display:'inline-flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginLeft:-5,border:'1.5px solid #fff',position:'relative',top:3}}>{NET_SYM[net]||'?'}</span>;
}
function Avatar({text,bg,size=26}){
  return <div style={{width:size,height:size,borderRadius:'50%',background:bg,color:'#fff',fontSize:size*0.35,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{text}</div>;
}
function TagPill({children,bg='#f3f4f6',c='#374151',bc='#e5e7eb'}){
  return <span style={{display:'inline-flex',alignItems:'center',gap:3,borderRadius:4,padding:'2px 7px',fontSize:10.5,fontWeight:500,whiteSpace:'nowrap',background:bg,color:c,border:`1px solid ${bc}`}}>{children}</span>;
}
function StatusPill({status,onClick}){
  const s=statusStyle(status);
  return <span onClick={onClick} style={{display:'inline-flex',alignItems:'center',gap:4,border:`1px solid ${s.borderColor}`,borderRadius:4,padding:'3px 8px',fontSize:11.5,fontWeight:500,cursor:'pointer',...s}}>{status} ▾</span>;
}

/* ─── ROW ───────────────────────────────────────────── */
function IntRow({r, selected, onClick, mode}){
  const isDisc = mode==='discover';
  const sc=sentColor(r.sentiment);
  return (
    <div onClick={onClick} style={{display:'grid',gridTemplateColumns: isDisc ? '96px 1fr 76px 140px 100px 1fr' : '28px 96px 1fr 76px 140px 100px 1fr',padding:'10px 16px',gap:8,borderBottom:'1px solid #f3f4f6',cursor:'pointer',background:selected?'#eff6ff':'#fff',borderLeft:selected?'3px solid #3b82f6':'3px solid transparent',alignItems:'start',transition:'background .1s'}}
      onMouseEnter={e=>{ if(!selected) e.currentTarget.style.background='#fafafa'; }}
      onMouseLeave={e=>{ if(!selected) e.currentTarget.style.background='#fff'; }}>
      {!isDisc && <div style={{paddingTop:2}}><input type="checkbox" onClick={e=>e.stopPropagation()} style={{cursor:'pointer'}}/></div>}
      <div style={{display:'flex',flexDirection:'column',gap:2}}>
        <span style={{fontSize:12,color:'#374151',fontWeight:r.unread?700:500}}>{r.date}</span>
        <span style={{fontSize:11,color:'#9ca3af'}}>{r.time}</span>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:3,minWidth:0,overflow:'hidden'}}>
        <div style={{display:'flex',alignItems:'center',gap:5}}>
          <Avatar text={r.avatar} bg={r.bg} size={24}/>
          <NetDot net={r.net}/>
          <span style={{fontSize:12.5,color:'#111827',fontWeight:r.unread?700:400,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.author}</span>
        </div>
        <div style={{fontSize:12,color:'#6b7280',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.snippet}</div>
        <div style={{display:'flex',gap:5,flexWrap:'wrap',marginTop:2}}>
          <TagPill>{r.tag}</TagPill>
          {isDisc && <TagPill bg={r.engLevel==='High'?'#f0fdf4':'#f9fafb'} c={r.engLevel==='High'?'#166534':'#6b7280'} bc={r.engLevel==='High'?'#bbf7d0':'#e5e7eb'}>{r.engagements}</TagPill>}
          {isDisc && <TagPill bg={sc.bg} c={sc.c} bc={sc.bc}>{sentIcon(r.sentiment)} {r.sentiment}</TagPill>}
        </div>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:5,fontSize:12.5,paddingTop:2}}>
        <div style={{width:7,height:7,borderRadius:'50%',background:priColor(r.priority),flexShrink:0}}/>
        {r.priority}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:5,fontSize:12,overflow:'hidden'}}>
        {r.assignee
          ? <><Avatar text={TEAMS[r.assignee]||'?'} bg={ASSIGNEE_COLORS[r.assignee]||'#888'} size={20}/><span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.assignee}</span></>
          : <span style={{color:'#9ca3af'}}>Unassigned</span>}
      </div>
      <StatusPill status={r.status}/>
      <div style={{fontSize:11.5,color:'#6b7280',overflow:'hidden'}}>
        {r.activity&&r.activity.length
          ? <><b style={{color:'#374151'}}>{r.activity[0].text.split(' ').slice(0,3).join(' ')}</b> {r.activity[0].text.split(' ').slice(3).join(' ')}</>
          : '—'}
      </div>
    </div>
  );
}

/* ─── DETAIL PANEL ──────────────────────────────────── */
function DetailPanel({record, allRecords, onSelect, onClose, onUpdate, mode}){
  const [rightTab,setRightTab]=useState('activity');
  const [reply,setReply]=useState('');
  const [liked,setLiked]=useState(false);
  const [reposted,setReposted]=useState(false);
  const [toast,setToast]=useState('');

  const showToast = useCallback((msg)=>{
    setToast(msg);
    setTimeout(()=>setToast(''),2500);
  },[]);

  const doLike=()=>{ setLiked(p=>!p); showToast(liked?'Like removed':'Post liked ♡'); };
  const doRepost=()=>{ setReposted(p=>!p); showToast(reposted?'Repost removed':'Reposted!'); };
  const doSend=()=>{
    if(!reply.trim()){ showToast('Type a reply first'); return; }
    const entry={icon:'green',text:'You replied: '+reply.substring(0,50),time:fmtNow()};
    onUpdate(record.id,{activity:[entry,...(record.activity||[])]});
    setReply('');
    showToast('Reply sent!');
  };

  const sc=sentColor(record.sentiment);
  const ss=statusStyle(record.status);

  return (
    <div style={{position:'fixed',inset:0,top:48,display:'flex',zIndex:200,background:'#fff',flexDirection:'column'}}>
      {/* topbar */}
      <div style={{display:'flex',alignItems:'center',padding:'0 16px',height:46,borderBottom:'1px solid #e5e7eb',gap:10,flexShrink:0}}>
        <button onClick={onClose} style={{width:28,height:28,border:'1px solid #e5e7eb',borderRadius:4,cursor:'pointer',background:'#fff',fontSize:14,display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
        <span style={{fontSize:13,color:'#374151',fontWeight:500,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{record.convTitle}</span>
        <button style={{border:'1px solid #e5e7eb',borderRadius:4,padding:'4px 10px',fontSize:12,cursor:'pointer',background:'#fff',color:'#374151'}}>🔗</button>
        <button style={{border:'1px solid #e5e7eb',borderRadius:4,padding:'4px 10px',fontSize:12,cursor:'pointer',background:'#fff',color:'#374151'}}>＋ Follow</button>
      </div>
      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        {/* LEFT LIST */}
        <div style={{width:250,borderRight:'1px solid #e5e7eb',overflowY:'auto',flexShrink:0}}>
          {allRecords.map(item=>(
            <div key={item.id} onClick={()=>onSelect(item.id)}
              style={{padding:'10px 12px',borderBottom:'1px solid #f3f4f6',cursor:'pointer',background:item.id===record.id?'#eff6ff':'#fff',borderLeft:item.id===record.id?'3px solid #1e40af':'3px solid transparent'}}>
              <div style={{display:'flex',alignItems:'center',gap:5,fontSize:12.5,fontWeight:600,color:'#111827',overflow:'hidden'}}>
                <Avatar text={item.avatar} bg={item.bg} size={16}/>
                <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.author}</span>
              </div>
              <div style={{fontSize:11.5,color:'#6b7280',marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.snippet}</div>
              <div style={{display:'flex',gap:5,marginTop:3,alignItems:'center'}}>
                <TagPill>{item.tag}</TagPill>
                <span style={{fontSize:10.5,color:'#9ca3af'}}>{item.date}</span>
              </div>
            </div>
          ))}
        </div>
        {/* CENTER */}
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
          {/* workflow bar */}
          <div style={{display:'flex',alignItems:'center',gap:0,padding:'8px 16px',borderBottom:'1px solid #e5e7eb',background:'#fafafa',flexShrink:0,flexWrap:'wrap',gap:8}}>
            {[['Assignee',record.assignee||'Unassigned',['Unassigned',...Object.keys(ASSIGNEE_COLORS)],'assignee'],
              ['Priority',record.priority,['Low','Medium','High'],'priority'],
              ['Status',record.status,['Open','Under Review','Closed'],'status']].map(([label,val,opts,key])=>(
              <div key={key} style={{display:'flex',alignItems:'center',gap:5,fontSize:11.5,paddingRight:12,marginRight:12,borderRight:'1px solid #e5e7eb'}}>
                <span style={{color:'#9ca3af',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.04em',fontSize:10.5}}>{label}:</span>
                <select value={val} onChange={e=>{
                  const upd = key==='assignee'
                    ? {assignee: e.target.value==='Unassigned'?'':e.target.value}
                    : {[key]:e.target.value};
                  const ts=fmtNow();
                  const msg = key==='assignee'?`Assigned to ${e.target.value} by Aswin Kumar`
                    :key==='priority'?`Aswin Kumar set priority to ${e.target.value}`
                    :`Aswin Kumar changed status to ${e.target.value}`;
                  onUpdate(record.id,{...upd,activity:[{icon:'blue',text:msg,time:ts},...(record.activity||[])]});
                  showToast(msg.substring(0,60));
                }} style={{border:'1px solid #e5e7eb',borderRadius:4,padding:'2px 6px',fontSize:12,background:'#fff',cursor:'pointer'}}>
                  {opts.map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          {/* conv body */}
          <div style={{flex:1,overflowY:'auto',padding:16}}>
            {mode==='discover' && record.matchedSearches && (
              <div style={{background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:5,padding:'6px 10px',fontSize:11.5,color:'#1d4ed8',marginBottom:12}}>
                Matched: <b>{record.matchedSearches.join(', ')}</b>
              </div>
            )}
            {record.origPost && (
              <div style={{border:'1px solid #e5e7eb',borderRadius:8,padding:12,marginBottom:12,background:'#fafafa'}}>
                <div style={{fontSize:11,color:'#9ca3af',marginBottom:6,fontWeight:500,textTransform:'uppercase',letterSpacing:'0.04em'}}>Original post</div>
                <div style={{fontSize:12.5,lineHeight:1.6,color:'#374151'}}>{record.origPost}</div>
                {record.origTime && <div style={{fontSize:11,color:'#9ca3af',marginTop:4}}>{record.origTime}</div>}
              </div>
            )}
            {(record.content) && (
              <div style={{border:'1px solid #e5e7eb',borderRadius:8,padding:14,marginBottom:10,background:'#fff'}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
                  <Avatar text={record.avatar} bg={record.bg} size={32}/>
                  <div>
                    <div style={{fontWeight:600,fontSize:13,color:'#111827'}}>{record.author}</div>
                    <div style={{fontSize:11.5,color:'#6b7280'}}>{record.handle}</div>
                  </div>
                  <div style={{marginLeft:'auto',fontSize:11,color:'#9ca3af'}}>{record.replyTime||record.date+' '+record.time}</div>
                </div>
                {record.engagements && <div style={{fontSize:11.5,color:'#6b7280',marginBottom:8}}>{record.engagements}</div>}
                <div style={{fontSize:13,lineHeight:1.6,color:'#1f2937',marginBottom:10}}>{record.content}</div>
                {record.canEngage ? (
                  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                    {[
                      {label: liked?'♡ Liked':'♡ Like', action:doLike, active:liked},
                      {label:'↩ Reply', action:()=>document.getElementById('replyInput')?.focus()},
                      ...(mode==='interactions'?[{label:reposted?'↻ Reposted':'↻ Repost',action:doRepost,active:reposted}]:[]),
                      {label:`↗ View on ${NET_LABEL[record.net]||record.net}`, action:()=>showToast('Opening externally...')},
                    ].map((btn,i)=>(
                      <button key={i} onClick={btn.action} style={{display:'flex',alignItems:'center',gap:4,fontSize:12,color:btn.active?'#1e40af':'#6b7280',background:btn.active?'#eff6ff':'transparent',border:'1px solid '+(btn.active?'#bfdbfe':'transparent'),borderRadius:4,padding:'4px 8px',cursor:'pointer',fontWeight:btn.active?600:400}}>{btn.label}</button>
                    ))}
                  </div>
                ) : (
                  <button onClick={()=>showToast('Opening externally...')} style={{fontSize:12,color:'#1e40af',background:'transparent',border:'none',cursor:'pointer',padding:0}}>↗ View on {NET_LABEL[record.net]||record.net}</button>
                )}
                {record.deleted && <div style={{marginTop:8,padding:'6px 10px',background:'#f9fafb',borderRadius:6,fontSize:12,color:'#6b7280',border:'1px solid #f3f4f6'}}>ⓘ This post has been deleted.</div>}
              </div>
            )}
          </div>
          {/* composer */}
          {record.canEngage ? (
            <div style={{padding:'10px 16px',borderTop:'1px solid #e5e7eb',display:'flex',gap:8,alignItems:'center',flexShrink:0}}>
              <Avatar text="SA" bg="#3b82f6" size={28}/>
              <input id="replyInput" value={reply} onChange={e=>setReply(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&(e.preventDefault(),doSend())}
                placeholder="Draft a reply…"
                style={{flex:1,border:'1px solid #e5e7eb',borderRadius:6,padding:'7px 10px',fontSize:13,color:'#374151',outline:'none'}}/>
              <button onClick={doSend} style={{background:'#1e40af',color:'#fff',border:'none',borderRadius:5,padding:'7px 14px',fontSize:12.5,cursor:'pointer',fontWeight:500,whiteSpace:'nowrap'}}>Send Reply</button>
            </div>
          ) : (
            <div style={{padding:'8px 16px',borderTop:'1px solid #e5e7eb',fontSize:12,color:'#9ca3af',flexShrink:0}}>
              ⚠ Engagement not supported for this content type.
            </div>
          )}
        </div>
        {/* RIGHT */}
        <div style={{width:230,borderLeft:'1px solid #e5e7eb',display:'flex',flexDirection:'column',flexShrink:0,overflow:'hidden'}}>
          <div style={{display:'flex',borderBottom:'1px solid #e5e7eb',flexShrink:0}}>
            {['activity','userinfo','history','replies'].map(t=>(
              <button key={t} onClick={()=>setRightTab(t)} style={{flex:1,padding:'8px 2px',fontSize:10,fontWeight:600,cursor:'pointer',background:'transparent',border:'none',borderBottom:`2px solid ${rightTab===t?'#1e40af':'transparent'}`,color:rightTab===t?'#1e40af':'#6b7280',textTransform:'uppercase',letterSpacing:'0.04em'}}>
                {t==='userinfo'?'USER INFO':t.toUpperCase()}
              </button>
            ))}
          </div>
          <div style={{flex:1,overflowY:'auto',padding:10}}>
            {rightTab==='activity' && (record.activity&&record.activity.length
              ? record.activity.map((a,i)=>(
                <div key={i} style={{padding:'7px 0',borderBottom:'1px solid #f3f4f6',fontSize:11.5,lineHeight:1.45,color:'#6b7280'}}>
                  <span style={{width:8,height:8,borderRadius:'50%',background:actIcon(a.icon),display:'inline-block',marginRight:5,flexShrink:0}}/>
                  {a.text}
                  <div style={{fontSize:10.5,color:'#9ca3af',marginTop:2}}>{a.time}</div>
                </div>
              ))
              : <div style={{fontSize:12,color:'#9ca3af',padding:'8px 0'}}>No activity yet.</div>
            )}
            {rightTab==='userinfo' && Object.entries(record.userInfo||{}).map(([k,v])=>(
              <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:'1px solid #f3f4f6',fontSize:12}}>
                <span style={{color:'#9ca3af'}}>{k}</span>
                <span style={{color:'#374151',textAlign:'right',maxWidth:130,wordBreak:'break-all'}}>{v}</span>
              </div>
            ))}
            {rightTab==='history' && (
              <div>
                {[['Priority',record.priority],['Status',record.status],['Assignee',record.assignee||'Unassigned']].map(([k,v])=>(
                  <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:'1px solid #f3f4f6',fontSize:12}}>
                    <span style={{color:'#9ca3af'}}>{k}</span>
                    <span style={{color:'#374151'}}>{v}</span>
                  </div>
                ))}
              </div>
            )}
            {rightTab==='replies' && <div style={{fontSize:12,color:'#9ca3af',padding:'8px 0'}}>No replies yet.</div>}
          </div>
        </div>
      </div>
      {/* toast */}
      {toast && <div style={{position:'absolute',bottom:20,right:20,background:'#1f2937',color:'#fff',borderRadius:7,padding:'9px 14px',fontSize:12.5,zIndex:10,boxShadow:'0 4px 16px rgba(0,0,0,.2)'}}>{toast}</div>}
    </div>
  );
}

/* ─── CREATE SEARCH MODAL ───────────────────────────── */
function CreateSearchModal({onClose, onCreate}){
  const [name,    setName]    = useState('');
  const [kws,     setKws]     = useState([]);
  const [kwInput, setKwInput] = useState('');
  const [matchMode,setMatchMode] = useState('any');
  const [srcs,    setSrcs]    = useState(new Set());
  const [advOpen,  setAdvOpen]  = useState(false);
  const [exInput,  setExInput]  = useState('');
  const [exKws,    setExKws]    = useState([]);
  const [fbPageInput, setFbPageInput] = useState('');
  const [fbPages,     setFbPages]     = useState([]);

  const sources = [
    {id:'fb', label:'Facebook',   bg:'#1877f2', sym:'f' },
    {id:'x',  label:'X / Twitter',bg:'#000',   sym:'𝕏' },
    {id:'ig', label:'Instagram',  bg:'#e1306c', sym:'◎' },
    {id:'rd', label:'Reddit',     bg:'#ff4500', sym:'●' },
    {id:'th', label:'Threads',    bg:'#1a1a2e', sym:'@' },
    {id:'yt', label:'YouTube',    bg:'#ff0000', sym:'▶' },
  ];

  const igNeedsHash = srcs.has('ig') && !kws.some(k => k.startsWith('#'));
  const fbNeedsPage = srcs.has('fb') && fbPages.length === 0;
  const canCreate   = name.trim() && kws.length > 0 && srcs.size > 0 && !igNeedsHash && !fbNeedsPage;

  const addKw  = () => { if(kwInput.trim()){ setKws(p=>[...p,kwInput.trim()]); setKwInput(''); } };
  const addExKw= () => { if(exInput.trim()){ setExKws(p=>[...p,exInput.trim()]); setExInput(''); } };

  const ChipInput = ({chips, onRemove, inputVal, onInputChange, onAdd, placeholder}) => (
    <div style={{border:'1px solid #e5e7eb',borderRadius:5,padding:'5px 8px',display:'flex',flexWrap:'wrap',gap:5,alignItems:'center',minHeight:36,cursor:'text'}}
      onClick={e=>e.currentTarget.querySelector('input')?.focus()}>
      {chips.map((k,i)=>(
        <span key={i} style={{display:'inline-flex',alignItems:'center',gap:4,background:'#eff6ff',color:'#1d4ed8',borderRadius:12,padding:'2px 9px',fontSize:11.5}}>
          {k} <span onClick={()=>onRemove(i)} style={{cursor:'pointer',fontSize:11,opacity:.7}}>×</span>
        </span>
      ))}
      <input value={inputVal} onChange={e=>onInputChange(e.target.value)}
        onKeyDown={e=>{ if(e.key==='Enter'){e.preventDefault();onAdd();} }}
        placeholder={chips.length===0 ? placeholder : ''}
        style={{border:'none',outline:'none',fontSize:12.5,flex:1,minWidth:60,color:'#374151',background:'transparent'}}/>
    </div>
  );

  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.4)',zIndex:400,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div onClick={e=>e.stopPropagation()} style={{background:'#fff',borderRadius:10,width:560,maxHeight:'88vh',overflowY:'auto',boxShadow:'0 20px 60px rgba(0,0,0,.2)',display:'flex',flexDirection:'column'}}>

        {/* Header */}
        <div style={{padding:'16px 20px 12px',borderBottom:'1px solid #e5e7eb',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
          <span style={{fontSize:15,fontWeight:600,color:'#111827'}}>Create search</span>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',fontSize:20,color:'#9ca3af',lineHeight:1}}>✕</button>
        </div>

        <div style={{padding:'16px 20px',display:'flex',flexDirection:'column',gap:16}}>

          {/* 1. Search name */}
          <div>
            <label style={{display:'block',fontSize:12.5,fontWeight:500,marginBottom:5,color:'#374151'}}>Search name</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Competitor opportunities"
              style={{width:'100%',border:'1px solid #e5e7eb',borderRadius:5,padding:'7px 10px',fontSize:13,outline:'none',color:'#1f2937',boxSizing:'border-box'}}/>
          </div>

          {/* 2. Keywords + match condition */}
          <div>
            <label style={{display:'block',fontSize:12.5,fontWeight:500,marginBottom:8,color:'#374151'}}>Keywords or hashtags</label>
            <ChipInput chips={kws} onRemove={i=>setKws(p=>p.filter((_,j)=>j!==i))}
              inputVal={kwInput} onInputChange={setKwInput} onAdd={addKw} placeholder="Type and press Enter…"/>
            {igNeedsHash && (
              <div style={{marginTop:6,background:'#fff3cd',border:'1px solid #fde68a',borderRadius:5,padding:'6px 10px',fontSize:12,color:'#92400e'}}>
                ⚠ Instagram requires at least one hashtag (e.g. #travel)
              </div>
            )}
            {/* Match condition — sits below the keyword box */}
            <div style={{display:'flex',gap:18,marginTop:8}}>
              {[['any','Any of these'],['all','All of these']].map(([val,label])=>(
                <label key={val} style={{display:'flex',alignItems:'center',gap:5,fontSize:12.5,cursor:'pointer',color:matchMode===val?'#111827':'#6b7280',fontWeight:matchMode===val?500:400}}>
                  <input type="radio" name="kwMode" value={val} checked={matchMode===val} onChange={()=>setMatchMode(val)}
                    style={{accentColor:'#1e40af',cursor:'pointer'}}/>
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* 3. Sources */}
          <div>
            <label style={{display:'block',fontSize:12.5,fontWeight:500,marginBottom:8,color:'#374151'}}>Sources</label>
            <div style={{display:'flex',gap:5}}>
              {sources.map(s=>(
                <div key={s.id} onClick={()=>setSrcs(p=>{ const n=new Set(p); n.has(s.id)?n.delete(s.id):n.add(s.id); return n; })}
                  style={{border:`1.5px solid ${srcs.has(s.id)?'#1e40af':'#e5e7eb'}`,borderRadius:6,padding:'8px 6px',textAlign:'center',cursor:'pointer',flex:1,minWidth:0,background:srcs.has(s.id)?'#eff6ff':'#fff',transition:'all .15s'}}>
                  <div style={{width:24,height:24,borderRadius:'50%',background:s.bg,color:'#fff',fontSize:11,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 5px'}}>{s.sym}</div>
                  <div style={{fontSize:10.5,color:srcs.has(s.id)?'#1e40af':'#6b7280',fontWeight:500}}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Facebook page config */}
          {srcs.has('fb') && (
            <div style={{border:'1.5px solid #bfdbfe',borderRadius:7,padding:'14px 16px',background:'#f0f7ff'}}>
              {/* Header */}
              <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:6}}>
                <div style={{width:20,height:20,borderRadius:'50%',background:'#1877f2',color:'#fff',fontSize:10,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>f</div>
                <span style={{fontSize:13,fontWeight:600,color:'#1e40af'}}>Facebook Pages</span>
                <span style={{fontSize:11,color:'#3b82f6',marginLeft:2}}>— required</span>
              </div>
              <div style={{fontSize:12,color:'#3b82f6',marginBottom:10,lineHeight:1.5}}>
                Facebook search only works within specific Pages you specify. Type the name of a Facebook Page and press Enter to add it.
              </div>
              {/* Chip input */}
              <div style={{border:`1.5px solid ${fbPages.length===0?'#f97316':'#bfdbfe'}`,borderRadius:6,padding:'6px 10px',display:'flex',flexWrap:'wrap',gap:6,alignItems:'center',minHeight:40,background:'#fff',cursor:'text'}}
                onClick={e=>e.currentTarget.querySelector('input')?.focus()}>
                {fbPages.map((pg,i)=>(
                  <span key={i} style={{display:'inline-flex',alignItems:'center',gap:5,background:'#dbeafe',color:'#1e40af',borderRadius:12,padding:'3px 10px',fontSize:12,fontWeight:500}}>
                    <span style={{width:14,height:14,borderRadius:'50%',background:'#1877f2',color:'#fff',fontSize:7,fontWeight:700,display:'inline-flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>f</span>
                    {pg}
                    <span onClick={()=>setFbPages(p=>p.filter((_,j)=>j!==i))} style={{cursor:'pointer',fontSize:12,opacity:.6,marginLeft:1}}>×</span>
                  </span>
                ))}
                <input value={fbPageInput} onChange={e=>setFbPageInput(e.target.value)}
                  onKeyDown={e=>{ if(e.key==='Enter'&&fbPageInput.trim()){ e.preventDefault(); setFbPages(p=>[...p,fbPageInput.trim()]); setFbPageInput(''); } }}
                  placeholder={fbPages.length===0 ? 'e.g. Zylker Travels, Nike, Reebok…' : 'Add another page…'}
                  style={{border:'none',outline:'none',fontSize:12.5,flex:1,minWidth:140,color:'#374151',background:'transparent'}}/>
              </div>
              {/* Validation hint */}
              {fbPages.length === 0
                ? <div style={{marginTop:8,fontSize:11.5,color:'#f97316',display:'flex',alignItems:'center',gap:5,fontWeight:500}}>⚠ Add at least one Facebook Page to enable this source.</div>
                : <div style={{marginTop:8,fontSize:11.5,color:'#10b981',display:'flex',alignItems:'center',gap:5}}><span>✓</span> {fbPages.length} page{fbPages.length>1?'s':''} added</div>
              }
            </div>
          )}

          {/* Reddit scope — shown when Reddit selected */}
          {srcs.has('rd') && (
            <div style={{border:'1px solid #e5e7eb',borderRadius:5,padding:'10px 12px'}}>
              <div style={{fontSize:12.5,fontWeight:500,marginBottom:8,color:'#374151'}}>Reddit scope</div>
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                {[['all','All Reddit'],['specific','Specific communities']].map(([val,label])=>(
                  <label key={val} style={{display:'flex',alignItems:'center',gap:6,fontSize:12.5,cursor:'pointer',color:'#374151'}}>
                    <input type="radio" name="rdScope" defaultChecked={val==='all'} style={{accentColor:'#1e40af',cursor:'pointer'}}/> {label}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* 4. Advanced configuration — collapsed by default */}
          <div style={{border:'1px solid #e5e7eb',borderRadius:6,overflow:'hidden'}}>
            <div onClick={()=>setAdvOpen(p=>!p)}
              style={{padding:'9px 12px',background:'#f9fafb',fontSize:12.5,fontWeight:500,color:'#374151',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',userSelect:'none'}}>
              <span>Advanced configuration</span>
              <span style={{fontSize:11,color:'#9ca3af'}}>{advOpen ? '▲' : '▼'}</span>
            </div>
            {advOpen && (
              <div style={{padding:'14px 12px',display:'flex',flexDirection:'column',gap:14,borderTop:'1px solid #e5e7eb'}}>
                <div>
                  <label style={{display:'block',fontSize:12.5,fontWeight:500,marginBottom:6,color:'#374151'}}>Exclude keywords or hashtags</label>
                  <ChipInput chips={exKws} onRemove={i=>setExKws(p=>p.filter((_,j)=>j!==i))}
                    inputVal={exInput} onInputChange={setExInput} onAdd={addExKw} placeholder="Type and press Enter…"/>
                </div>
                <div>
                  <label style={{display:'block',fontSize:12.5,fontWeight:500,marginBottom:6,color:'#374151'}}>Languages</label>
                  <div style={{border:'1px solid #e5e7eb',borderRadius:5,padding:'5px 8px',minHeight:34,display:'flex',gap:5,alignItems:'center',flexWrap:'wrap'}}>
                    <span style={{display:'inline-flex',alignItems:'center',gap:4,background:'#eff6ff',color:'#1d4ed8',borderRadius:12,padding:'2px 9px',fontSize:11.5}}>
                      English <span style={{cursor:'pointer',opacity:.7}}>×</span>
                    </span>
                    <input placeholder="Add language…" style={{border:'none',outline:'none',fontSize:12.5,flex:1,minWidth:80,color:'#374151'}}/>
                  </div>
                </div>
                <label style={{display:'flex',alignItems:'flex-start',gap:8,fontSize:12.5,cursor:'pointer',color:'#374151'}}>
                  <input type="checkbox" defaultChecked style={{marginTop:2,accentColor:'#1e40af'}}/>
                  <div>
                    <div style={{fontWeight:500}}>Reduce noise</div>
                    <div style={{fontSize:11.5,color:'#6b7280',marginTop:2,lineHeight:1.4}}>Filter out promotions, spam, giveaways, and bot-like content.</div>
                  </div>
                </label>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div style={{padding:'12px 20px',borderTop:'1px solid #e5e7eb',display:'flex',justifyContent:'flex-end',gap:8,flexShrink:0}}>
          <button onClick={onClose} style={{border:'1px solid #e5e7eb',borderRadius:5,padding:'7px 16px',fontSize:13,cursor:'pointer',background:'#fff',color:'#374151'}}>Cancel</button>
          <button disabled={!canCreate} onClick={()=>{ if(canCreate){ onCreate(name.trim()); onClose(); } }}
            style={{background:canCreate?'#1e40af':'#bfdbfe',color:'#fff',border:'none',borderRadius:5,padding:'7px 18px',fontSize:13,cursor:canCreate?'pointer':'not-allowed',fontWeight:500}}>
            Create search
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN APP ──────────────────────────────────────── */
export default function App(){
  const [mode,setMode]=useState('interactions');
  const [net,setNet]=useState('all');
  const [detail,setDetail]=useState(null);
  const [intData,setIntData]=useState(INTERACTIONS.map(r=>({...r})));
  const [discData,setDiscData]=useState(DISCOVER.map(r=>({...r})));
  const [searches,setSearches]=useState(SEARCHES_ENGAGING.map(s=>({...s})));
  const [listening,setListening]=useState(SEARCHES_LISTENING.map(s=>({...s})));
  const [showSearchDrop,setShowSearchDrop]=useState(false);
  const [showMoreDrop,setShowMoreDrop]=useState(false);
  const [showCreateModal,setShowCreateModal]=useState(false);
  const [moreFilters,setMoreFilters]=useState({types:[],sentiments:[],engLevels:[]});
  const [sortMode,setSortMode]=useState('Most relevant');
  const [updating,setUpdating]=useState(false);
  const [toast,setToast]=useState('');
  const [ctxSearch,setCtxSearch]=useState(null);
  const [ctxPos,setCtxPos]=useState({x:0,y:0});
  const [alertSearch,setAlertSearch]=useState(null);

  const showToast=(msg)=>{ setToast(msg); setTimeout(()=>setToast(''),2500); };

  // filtered & sorted rows
  const intRows = intData.filter(r=>net==='all'||r.net===net);
  const discRows = (() => {
    let list = discData.filter(r=>DISC_NETS.includes(r.net) && (net==='all'||r.net===net));
    if(moreFilters.types.length) list=list.filter(r=>moreFilters.types.includes(r.type));
    if(moreFilters.sentiments.length) list=list.filter(r=>moreFilters.sentiments.includes(r.sentiment));
    if(moreFilters.engLevels.length) list=list.filter(r=>moreFilters.engLevels.map(e=>e==='High engagement'?'High':'Low').includes(r.engLevel));
    if(sortMode==='Most recent') list=[...list].sort((a,b)=>b.date.localeCompare(a.date)||b.time.localeCompare(a.time));
    if(sortMode==='Most engaged') list=[...list].sort((a,b)=>(parseInt(b.engagements)||0)-(parseInt(a.engagements)||0));
    return list;
  })();

  const activeRows = mode==='interactions' ? intRows : discRows;
  const activeData = mode==='interactions' ? intData : discData;
  const detailRecord = detail ? activeData.find(r=>r.id===detail) : null;

  const updateRecord = useCallback((id, updates)=>{
    if(mode==='interactions') setIntData(p=>p.map(r=>r.id===id?{...r,...updates}:r));
    else setDiscData(p=>p.map(r=>r.id===id?{...r,...updates}:r));
  },[mode]);

  const enabledSearches = [...searches,...listening].filter(s=>s.enabled);
  const firstSearch = enabledSearches[0];
  const extraCount = enabledSearches.length-1;

  const MFOPT = [
    {group:'types',label:'Type',opts:['Post','Comment']},
    {group:'sentiments',label:'Sentiment',opts:['Positive','Neutral','Negative']},
    {group:'engLevels',label:'Engagement',opts:['High engagement','Low engagement']},
  ];

  const netBarSrc = mode==='interactions' ? NETWORKS_INT : NETWORKS_DISC;

  return (
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",fontSize:13,background:'#f0f2f5',color:'#1f2937',height:'100vh',display:'flex',flexDirection:'column',overflow:'hidden'}} onClick={()=>{ setShowSearchDrop(false); setShowMoreDrop(false); setCtxSearch(null); }}>
      {/* ── TOP NAV ── */}
      <div style={{background:'#1a2540',display:'flex',alignItems:'center',padding:'0 16px',height:48,gap:0,flexShrink:0}}>
        <div style={{display:'flex',alignItems:'center',gap:6,color:'#fff',fontSize:13,fontWeight:500,cursor:'pointer',padding:'4px 8px',borderRadius:4,marginRight:8}}>
          <div style={{width:22,height:22,background:'#3b82f6',borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'#fff',fontWeight:700,flexShrink:0}}>ZT</div>
          Zylker Travels <span style={{color:'#ffffff66',fontSize:10,marginLeft:2}}>▾</span>
        </div>
        <div style={{width:1,height:24,background:'#ffffff22',margin:'0 12px'}}/>
        {['Home','Posts','Mesages','Inbox','Monitor','Connections','Reports','···'].map((l,i)=>(
          <div key={i} style={{color:l==='Inbox'?'#fff':'#ffffffaa',padding:'6px 12px',borderRadius:4,fontSize:13,cursor:'pointer',fontWeight:l==='Inbox'?600:400}}>{l}</div>
        ))}
        <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:10}}>
          <button style={{background:'#3b82f6',color:'#fff',border:'none',borderRadius:5,padding:'7px 14px',fontSize:13,cursor:'pointer',fontWeight:500}}>＋ New Post ▾</button>
          <div style={{width:28,height:28,borderRadius:'50%',background:'#3b82f6',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:11,fontWeight:700,cursor:'pointer'}}>SA</div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{display:'flex',flexDirection:'column',flex:1,background:'#fff',overflow:'hidden'}}>

        {/* ── TOOLBAR 1 ── */}
        <div style={{display:'flex',alignItems:'center',padding:'0 16px',height:52,borderBottom:'1px solid #e5e7eb',gap:10,flexShrink:0}}>
          <button style={{display:'flex',alignItems:'center',gap:5,border:'1px solid #e5e7eb',borderRadius:6,padding:'6px 12px',cursor:'pointer',fontSize:13,fontWeight:500,background:'#fff',whiteSpace:'nowrap'}}>
            All Interactions <span style={{color:'#6b7280',fontSize:9}}>▾</span>
          </button>
          <div style={{display:'flex',gap:3,alignItems:'center',flex:1,overflowX:'auto'}}>
            {netBarSrc.map(n=>(
              <div key={n.id} onClick={e=>{e.stopPropagation();setNet(n.id);}}
                style={{width:n.id==='all'?'auto':30,height:30,borderRadius:n.id==='all'?15:'50%',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:n.fs||11,fontWeight:700,color:'#fff',flexShrink:0,border:`2.5px solid ${net===n.id?'#3b82f6':'transparent'}`,boxShadow:net===n.id?'0 0 0 2px #eff6ff':'none',background:n.style?.background||n.bg||'transparent',...(n.style||{})}}>
                {n.label||n.sym}
              </div>
            ))}
          </div>
          <div style={{display:'flex',border:'1px solid #e5e7eb',borderRadius:6,overflow:'hidden',flexShrink:0}}>
            {['interactions','discover'].map(m=>(
              <button key={m} onClick={()=>{ setMode(m); setDetail(null); }}
                style={{padding:'6px 18px',fontSize:13,cursor:'pointer',border:'none',color:mode===m?'#fff':'#6b7280',fontWeight:500,background:mode===m?'#1e40af':'#fff',textTransform:'capitalize',whiteSpace:'nowrap'}}>
                {m.charAt(0).toUpperCase()+m.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* ── TOOLBAR 2 ── */}
        <div style={{display:'flex',alignItems:'center',padding:'0 16px',height:46,borderBottom:'1px solid #e5e7eb',gap:8,flexShrink:0,position:'relative'}}>
          {mode==='discover' && <>
            {/* Search dropdown button */}
            <div onClick={e=>{e.stopPropagation();setShowSearchDrop(p=>!p);}} style={{display:'flex',alignItems:'center',gap:6,border:'1px solid #e5e7eb',borderRadius:5,padding:'5px 11px',fontSize:12.5,cursor:'pointer',background:'#fff',fontWeight:500,position:'relative',flexShrink:0}}>
              🔍 {firstSearch?firstSearch.label.split(' ')[0]:'None'}
              {extraCount>0 && <span style={{background:'#1e40af',color:'#fff',borderRadius:10,padding:'1px 7px',fontSize:10,fontWeight:600}}>+{extraCount}</span>}
              <span style={{color:'#6b7280',fontSize:9}}>▾</span>
            </div>
            {/* Search dropdown */}
            {showSearchDrop && (
              <div onClick={e=>e.stopPropagation()} style={{position:'absolute',top:44,left:16,background:'#fff',border:'1px solid #e5e7eb',borderRadius:8,boxShadow:'0 8px 24px rgba(0,0,0,.12)',zIndex:100,width:270,overflow:'hidden'}}>
                <div style={{padding:'6px 0',borderBottom:'1px solid #f3f4f6'}}>
                  <div style={{padding:'5px 14px 3px',fontSize:10.5,fontWeight:600,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'0.06em'}}>Engaging searches</div>
                  {searches.map(s=>(
                    <div key={s.id} style={{display:'flex',alignItems:'center',gap:8,padding:'6px 14px',cursor:'pointer',fontSize:12.5,color:'#374151',position:'relative'}}
                      onMouseEnter={e=>{e.currentTarget.style.background='#f9fafb';}} onMouseLeave={e=>{e.currentTarget.style.background='transparent';}}>
                      <input type="checkbox" checked={s.enabled} onChange={e=>setSearches(p=>p.map(x=>x.id===s.id?{...x,enabled:e.target.checked}:x))} style={{cursor:'pointer',accentColor:'#1e40af'}}/>
                      <label style={{flex:1,cursor:'pointer'}}>{s.label}</label>
                      <span onClick={e=>{e.stopPropagation();setCtxSearch(s.id);setCtxPos({x:e.clientX,y:e.clientY});}}
                        style={{padding:'2px 6px',borderRadius:4,cursor:'pointer',fontSize:13,color:'#9ca3af',marginLeft:'auto',flexShrink:0}}
                        title="More options">⋯</span>
                    </div>
                  ))}
                </div>
                <div style={{padding:'6px 0',borderBottom:'1px solid #f3f4f6'}}>
                  <div style={{padding:'5px 14px 3px',fontSize:10.5,fontWeight:600,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'0.06em'}}>Listening topics</div>
                  {listening.map(s=>(
                    <div key={s.id} style={{display:'flex',alignItems:'center',gap:8,padding:'6px 14px',cursor:'pointer',fontSize:12.5,color:'#374151'}}>
                      <input type="checkbox" checked={s.enabled} onChange={e=>setListening(p=>p.map(x=>x.id===s.id?{...x,enabled:e.target.checked}:x))} style={{cursor:'pointer',accentColor:'#1e40af'}}/>
                      <label style={{flex:1,cursor:'pointer'}}>{s.label}</label>
                    </div>
                  ))}
                </div>
                <div onClick={()=>{setShowSearchDrop(false);setShowCreateModal(true);}} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',cursor:'pointer',fontSize:12.5,color:'#1e40af',fontWeight:500}}
                  onMouseEnter={e=>{e.currentTarget.style.background='#eff6ff';}} onMouseLeave={e=>{e.currentTarget.style.background='transparent';}}>
                  ＋ Create search
                </div>
              </div>
            )}
            {/* Update button */}
            <button onClick={()=>{setUpdating(true);setTimeout(()=>{setUpdating(false);showToast('18 new conversations found');},2000);}} style={{display:'flex',alignItems:'center',gap:5,border:'1px solid #e5e7eb',borderRadius:5,padding:'5px 11px',fontSize:12.5,cursor:'pointer',background:'#fff',fontWeight:500,flexShrink:0}}>
              {updating?'⟳ Updating…':'⟳ Update'}
            </button>
            <span style={{fontSize:12.5,color:'#6b7280',flexShrink:0}}>Filter by:</span>
          </>}
          {mode==='interactions' && <span style={{fontSize:12.5,color:'#6b7280',flexShrink:0}}>Filter by:</span>}

          {['Assignee','Priority','Status','📅 Date'].map(f=>(
            <button key={f} style={{display:'flex',alignItems:'center',gap:5,border:'1px solid #e5e7eb',borderRadius:5,padding:'5px 10px',fontSize:12.5,cursor:'pointer',background:'#fff',color:'#374151',whiteSpace:'nowrap',flexShrink:0}}>
              {f} <span style={{color:'#6b7280',fontSize:9}}>▾</span>
            </button>
          ))}

          {mode==='discover' && (
            <div style={{position:'relative',flexShrink:0}}>
              <button onClick={e=>{e.stopPropagation();setShowMoreDrop(p=>!p);}} style={{display:'flex',alignItems:'center',gap:5,border:'1px solid #e5e7eb',borderRadius:5,padding:'5px 10px',fontSize:12.5,cursor:'pointer',background:'#fff',color:'#374151',whiteSpace:'nowrap'}}>
                More <span style={{color:'#6b7280',fontSize:9}}>▾</span>
              </button>
              {showMoreDrop && (
                <div onClick={e=>e.stopPropagation()} style={{position:'absolute',top:36,left:0,background:'#fff',border:'1px solid #e5e7eb',borderRadius:8,boxShadow:'0 8px 24px rgba(0,0,0,.12)',zIndex:100,width:220,padding:'6px 0'}}>
                  {MFOPT.map(({group,label,opts})=>(
                    <div key={group} style={{padding:'4px 14px 8px'}}>
                      <div style={{fontSize:11,fontWeight:600,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>{label}</div>
                      {opts.map(opt=>(
                        <label key={opt} style={{display:'flex',alignItems:'center',gap:7,padding:'4px 0',fontSize:12.5,cursor:'pointer',color:'#374151'}}>
                          <input type="checkbox" checked={moreFilters[group].includes(opt)} onChange={e=>setMoreFilters(p=>({...p,[group]:e.target.checked?[...p[group],opt]:p[group].filter(x=>x!==opt)}))} style={{accentColor:'#1e40af',cursor:'pointer'}}/>
                          {opt}
                        </label>
                      ))}
                      <div style={{height:1,background:'#f3f4f6',margin:'4px 0'}}/>
                    </div>
                  ))}
                  <div onClick={()=>setMoreFilters({types:[],sentiments:[],engLevels:[]})} style={{padding:'4px 14px 6px',fontSize:12,color:'#1e40af',cursor:'pointer',fontWeight:500}}>Clear all</div>
                </div>
              )}
            </div>
          )}

          <label style={{display:'flex',alignItems:'center',gap:5,fontSize:12.5,cursor:'pointer',flexShrink:0}}>
            <input type="checkbox"/> View unread
          </label>

          {mode==='discover' ? (
            <div style={{display:'flex',alignItems:'center',gap:6,marginLeft:'auto',fontSize:12.5,color:'#6b7280',whiteSpace:'nowrap',flexShrink:0}}>
              Sort by:
              <select value={sortMode} onChange={e=>setSortMode(e.target.value)} style={{border:'1px solid #e5e7eb',borderRadius:5,padding:'4px 8px',fontSize:12.5,cursor:'pointer',background:'#fff',color:'#374151'}}>
                {['Most relevant','Most recent','Most engaged'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
          ) : (
            <div style={{marginLeft:'auto',fontSize:12.5,color:'#6b7280',whiteSpace:'nowrap',flexShrink:0}}>
              Total Interactions: <b style={{color:'#374151'}}>{intRows.length}</b>
            </div>
          )}
        </div>

        {/* ── TABLE ── */}
        <div style={{flex:1,overflowY:'auto',overflowX:'hidden'}}>
          {/* Header */}
          <div style={{display:'grid',gridTemplateColumns: mode==='interactions' ? '28px 96px 1fr 76px 140px 100px 1fr' : '96px 1fr 76px 140px 100px 1fr',padding:'8px 16px',background:'#f9fafb',borderBottom:'1px solid #e5e7eb',gap:8,position:'sticky',top:0,zIndex:2}}>
            {mode==='interactions' && <div/>}
            {['Date','Interaction','Priority','Assignee','Status','Recent Activity'].map(h=>(
              <div key={h} style={{fontSize:11,fontWeight:600,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'0.05em'}}>{h}</div>
            ))}
          </div>
          {/* Rows */}
          {activeRows.map(r=>(
            <IntRow key={r.id} r={r} mode={mode} selected={detail===r.id}
              onClick={()=>{ setDetail(r.id); }}/>
          ))}
          {activeRows.length===0 && (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'60px 30px',gap:10,textAlign:'center'}}>
              <div style={{fontSize:32}}>🔍</div>
              <div style={{fontSize:15,fontWeight:500,color:'#374151'}}>No results</div>
              <div style={{fontSize:13,color:'#9ca3af'}}>Try adjusting your filters or search terms.</div>
            </div>
          )}
        </div>
      </div>

      {/* ── DETAIL PANEL ── */}
      {detailRecord && (
        <DetailPanel
          record={detailRecord}
          allRecords={activeRows}
          mode={mode}
          onSelect={(id)=>setDetail(id)}
          onClose={()=>setDetail(null)}
          onUpdate={updateRecord}
        />
      )}

      {/* ── CREATE SEARCH MODAL ── */}
      {showCreateModal && (
        <CreateSearchModal
          onClose={()=>setShowCreateModal(false)}
          onCreate={(name)=>{ setSearches(p=>[...p,{id:'es'+Date.now(),label:name,enabled:true}]); showToast(`"${name}" search created`); }}
        />
      )}

      {/* ── CONTEXT MENU ── */}
      {ctxSearch && (
        <div onClick={e=>e.stopPropagation()} style={{position:'fixed',left:ctxPos.x,top:ctxPos.y,background:'#fff',border:'1px solid #e5e7eb',borderRadius:6,boxShadow:'0 4px 16px rgba(0,0,0,.12)',zIndex:300,width:160,overflow:'hidden',padding:'4px 0'}}>
          <div onClick={()=>{ setCtxSearch(null); setShowCreateModal(true); }} style={{padding:'7px 14px',fontSize:12.5,cursor:'pointer',color:'#374151'}}
            onMouseEnter={e=>{e.currentTarget.style.background='#f9fafb';}} onMouseLeave={e=>{e.currentTarget.style.background='transparent';}}>Edit search</div>
          <div onClick={()=>{ const s=searches.find(x=>x.id===ctxSearch); setAlertSearch(s||null); setCtxSearch(null); }} style={{padding:'7px 14px',fontSize:12.5,cursor:'pointer',color:'#374151'}}
            onMouseEnter={e=>{e.currentTarget.style.background='#f9fafb';}} onMouseLeave={e=>{e.currentTarget.style.background='transparent';}}>Alerts</div>
          <div onClick={()=>{ setSearches(p=>{ const s=p.find(x=>x.id===ctxSearch); if(s) showToast(`"${s.label}" search deleted`); return p.filter(x=>x.id!==ctxSearch); }); setCtxSearch(null); }} style={{padding:'7px 14px',fontSize:12.5,cursor:'pointer',color:'#dc2626'}}
            onMouseEnter={e=>{e.currentTarget.style.background='#fef2f2';}} onMouseLeave={e=>{e.currentTarget.style.background='transparent';}}>Delete search</div>
        </div>
      )}

      {/* ── ALERTS MODAL ── */}
      {alertSearch && <AlertsModal searchLabel={alertSearch.label} onClose={()=>setAlertSearch(null)} />}

      {/* ── GLOBAL TOAST ── */}
      {toast && <div style={{position:'fixed',bottom:20,right:20,background:'#1f2937',color:'#fff',borderRadius:7,padding:'9px 14px',fontSize:12.5,zIndex:600,boxShadow:'0 4px 16px rgba(0,0,0,.25)',pointerEvents:'none'}}>{toast}</div>}
    </div>
  );
}
