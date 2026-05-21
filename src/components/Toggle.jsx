export default function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={'toggle' + (on ? ' on' : '')}
      aria-label="Marquer comme vendu"
      role="switch"
      aria-checked={on}
    />
  );
}
