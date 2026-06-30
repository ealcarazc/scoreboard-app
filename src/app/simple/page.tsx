'use client';

export default function SimplePage() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#ff0000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '2rem'
    }}>
      <h1 style={{ color: 'white', fontSize: '2rem' }}>TEST ALERT</h1>

      <button
        onClick={() => {
          alert('¡CLICK FUNCIONÓ!');
          console.log('click works');
        }}
        style={{
          padding: '2rem',
          fontSize: '2rem',
          backgroundColor: '#ffff00',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        PRESIONA
      </button>

      <p style={{ color: 'white', fontSize: '1.5rem' }}>
        Si ves un alert, React funciona
      </p>
    </div>
  );
}
