import { useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { MapPin, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { useApplications } from '../context/ApplicationContext';
import { KANBAN_COLUMNS, STATUS_COLORS } from '../constants';
import { daysSince, needsFollowUp, formatDate } from '../utils/helpers';

function KanbanCard({ app, index, onSelect }) {
  const days = daysSince(app.dateApplied);
  const followUp = needsFollowUp(app);
  const color = STATUS_COLORS[app.status]?.text || '#6b7280';

  return (
    <Draggable draggableId={app.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onSelect(app)}
          className={`jt-kanban-card ${snapshot.isDragging ? 'dragging' : ''}`}
          style={{ ...provided.draggableProps.style }}
        >
          <div style={{ height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${color}, transparent)`, marginBottom: 10 }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {app.company}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-sub)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {app.role}
          </div>
          <div className="d-flex flex-wrap gap-2 mt-2">
            {app.location && (
              <span className="d-flex align-items-center gap-1" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                <MapPin size={10} />{app.location}
              </span>
            )}
            {days !== null && (
              <span className="d-flex align-items-center gap-1" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                <Clock size={10} />{days}d ago
              </span>
            )}
          </div>
          {followUp && (
            <div className="d-inline-flex align-items-center gap-1 mt-2 px-2 py-1 rounded-2" style={{ fontSize: 11, fontWeight: 500, color: '#d97706', background: 'rgba(245,158,11,.1)' }}>
              <AlertTriangle size={10} /> Follow up
            </div>
          )}
          {app.interviewDate && new Date(app.interviewDate) >= new Date() && (
            <div className="d-inline-flex align-items-center gap-1 mt-2 px-2 py-1 rounded-2" style={{ fontSize: 11, fontWeight: 500, color: '#6366f1', background: 'rgba(99,102,241,.1)' }}>
              <Calendar size={10} /> {formatDate(app.interviewDate)}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

export default function KanbanBoard({ filteredApplications, onSelectApp }) {
  const { updateApplication } = useApplications();

  const columns = useMemo(() => {
    const cols = {};
    KANBAN_COLUMNS.forEach((s) => { cols[s] = filteredApplications.filter((a) => a.status === s); });
    return cols;
  }, [filteredApplications]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const app = filteredApplications.find((a) => a.id === draggableId);
    if (app && app.status !== destination.droppableId) {
      updateApplication({ ...app, status: destination.droppableId });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* Outer scroll container — fills remaining viewport height */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          overflowX: 'auto',
          overflowY: 'hidden',
          /* navbar ~64px + filterbar ~52px + top padding ~40px + bottom padding ~48px */
          height: 'calc(100vh - 204px)',
          minHeight: 480,
          paddingBottom: 8,
        }}
      >
        {KANBAN_COLUMNS.map((status) => {
          const color = STATUS_COLORS[status]?.text || '#6b7280';
          return (
            <div
              key={status}
              style={{
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
                /* fluid width: fills evenly up to 7 cols, min 160px, max 220px */
                width: 'clamp(160px, calc((100vw - 80px) / 7), 220px)',
                height: '100%',
              }}
            >
              {/* Column header */}
              <div className="jt-col-header" style={{ borderTop: `2.5px solid ${color}`, flexShrink: 0 }}>
                <div className="d-flex align-items-center gap-2">
                  <span className="rounded-circle" style={{ width: 7, height: 7, background: color, display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {status}
                  </span>
                </div>
                <span className="rounded-pill" style={{ fontSize: 10, fontWeight: 700, background: `${color}1a`, color, padding: '1px 7px', flexShrink: 0 }}>
                  {columns[status].length}
                </span>
              </div>

              {/* Droppable — scrolls vertically inside the fixed-height column */}
              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      flex: 1,
                      overflowY: 'auto',
                      padding: 8,
                      background: snapshot.isDraggingOver ? `${color}0d` : 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderTop: 'none',
                      borderRadius: '0 0 12px 12px',
                      outline: snapshot.isDraggingOver ? `2px solid ${color}40` : 'none',
                      outlineOffset: -2,
                      transition: 'background .15s',
                    }}
                  >
                    {columns[status].map((app, idx) => (
                      <KanbanCard key={app.id} app={app} index={idx} onSelect={onSelectApp} />
                    ))}
                    {provided.placeholder}
                    {columns[status].length === 0 && (
                      <div
                        className="d-flex align-items-center justify-content-center rounded-3"
                        style={{ height: 56, fontSize: 11, color: 'var(--text-muted)', border: '1.5px dashed var(--border)' }}
                      >
                        Drop here
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
