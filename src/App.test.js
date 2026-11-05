import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { STORAGE_KEYS } from './services/storageService';

describe('Joineazy Dashboard Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders student dashboard with student welcome section and isolation', () => {
    localStorage.setItem(
      STORAGE_KEYS.CURRENT_USER,
      JSON.stringify({
        id: 'student1',
        name: 'Alex Johnson',
        email: 'student1@joineazy.com',
        role: 'student',
      })
    );

    render(<App />);

    expect(screen.getByText(/welcome back, alex johnson!/i)).toBeInTheDocument();
    expect(screen.getByText(/total assigned/i)).toBeInTheDocument();

    expect(
      screen.getByText(/cloud native microservices architecture case study/i)
    ).toBeInTheDocument();

    expect(
      screen.queryByText(/distributed sql indexing & query latency optimization/i)
    ).not.toBeInTheDocument();
  });

  test('executes two-step submission workflow for student', async () => {
    localStorage.setItem(
      STORAGE_KEYS.CURRENT_USER,
      JSON.stringify({
        id: 'student1',
        name: 'Alex Johnson',
        email: 'student1@joineazy.com',
        role: 'student',
      })
    );

    render(<App />);

    const submitButtons = screen.getAllByRole('button', { name: /yes, i have submitted/i });
    expect(submitButtons.length).toBeGreaterThan(0);

    fireEvent.click(submitButtons[0]);

    expect(
      screen.getByRole('heading', { name: /confirm submission/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/verify your deliverables before recording your final submission/i)
    ).toBeInTheDocument();

    const confirmButton = screen.getByRole('button', { name: /confirm submission/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(
        screen.queryByText(/verify your deliverables before recording your final submission/i)
      ).not.toBeInTheDocument();
    });

    expect(screen.getAllByText(/submitted on/i).length).toBeGreaterThan(0);
  });

  test('renders admin dashboard with admin isolation', () => {
    localStorage.setItem(
      STORAGE_KEYS.CURRENT_USER,
      JSON.stringify({
        id: 'admin2',
        name: 'Prof. David Miller',
        email: 'admin2@joineazy.com',
        role: 'admin',
      })
    );

    render(<App />);

    expect(screen.getByText(/welcome, prof. david miller!/i)).toBeInTheDocument();

    expect(
      screen.getByText(/compiler construction: lexical analysis & abstract syntax tree/i)
    ).toBeInTheDocument();

    expect(
      screen.queryByText(/cloud native microservices architecture case study/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/distributed sql indexing & query latency optimization/i)
    ).not.toBeInTheDocument();
  });

  test('allows switching accounts between Admin and Student via quick switcher', async () => {
    localStorage.setItem(
      STORAGE_KEYS.CURRENT_USER,
      JSON.stringify({
        id: 'student1',
        name: 'Alex Johnson',
        email: 'student1@joineazy.com',
        role: 'student',
      })
    );

    render(<App />);

    expect(screen.getByText(/welcome back, alex johnson!/i)).toBeInTheDocument();

    const switcherTrigger = screen.getByLabelText(/switch user account/i);
    fireEvent.click(switcherTrigger);

    expect(screen.getByText(/switch account/i)).toBeInTheDocument();

    const adminButton = screen.getByRole('button', { name: /prof\. sarah jenkins/i });
    fireEvent.click(adminButton);

    await waitFor(() => {
      expect(screen.getByText(/welcome, prof\. sarah jenkins!/i)).toBeInTheDocument();
      expect(screen.getByText(/faculty management portal/i)).toBeInTheDocument();
    });
  });

  test('renders mock login page when user is signed out', () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);

    render(<App />);

    expect(screen.getByText(/select demo user account/i)).toBeInTheDocument();
    expect(screen.getByText(/students \(5 seeded\)/i)).toBeInTheDocument();
    expect(screen.getByText(/admins \/ professors \(2 seeded\)/i)).toBeInTheDocument();
  });

  test('successfully creates a new assignment with working input boxes', async () => {
    localStorage.setItem(
      STORAGE_KEYS.CURRENT_USER,
      JSON.stringify({
        id: 'admin1',
        name: 'Prof. Sarah Jenkins',
        email: 'admin1@joineazy.com',
        role: 'admin',
      })
    );

    render(<App />);

    expect(screen.getByText(/welcome, prof\. sarah jenkins!/i)).toBeInTheDocument();

    const openCreateBtn = screen.getByRole('button', { name: /\+ create assignment/i });
    fireEvent.click(openCreateBtn);

    expect(screen.getByRole('heading', { name: /^create assignment$/i })).toBeInTheDocument();

    const titleInput = screen.getByPlaceholderText(/e\.g\. Distributed Database Sharding Analysis/i);
    const descInput = screen.getByPlaceholderText(/specify assignment requirements/i);

    fireEvent.change(titleInput, { target: { value: 'Advanced Distributed Caching System' } });
    expect(titleInput.value).toBe('Advanced Distributed Caching System');

    fireEvent.change(descInput, {
      target: { value: 'Implement an LRU cache with cluster-wide eviction protocol.' },
    });
    expect(descInput.value).toBe('Implement an LRU cache with cluster-wide eviction protocol.');

    const modalDialog = screen.getByRole('dialog');
    const submitBtn = modalDialog.querySelector('button[type="submit"]');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Advanced Distributed Caching System')).toBeInTheDocument();
    });
  });

  test('successfully edits an existing assignment with working input boxes', async () => {
    localStorage.setItem(
      STORAGE_KEYS.CURRENT_USER,
      JSON.stringify({
        id: 'admin1',
        name: 'Prof. Sarah Jenkins',
        email: 'admin1@joineazy.com',
        role: 'admin',
      })
    );

    render(<App />);

    expect(screen.getByText(/welcome, prof\. sarah jenkins!/i)).toBeInTheDocument();

    const editButtons = screen.getAllByLabelText(/edit assignment/i);
    expect(editButtons.length).toBeGreaterThan(0);
    fireEvent.click(editButtons[0]);

    expect(screen.getByRole('heading', { name: /^edit assignment$/i })).toBeInTheDocument();

    const titleInput = screen.getByPlaceholderText(/e\.g\. Distributed Database Sharding Analysis/i);
    expect(titleInput.value.length).toBeGreaterThan(0);

    fireEvent.change(titleInput, {
      target: { value: 'Renamed Assignment By Faculty Lead' },
    });
    expect(titleInput.value).toBe('Renamed Assignment By Faculty Lead');

    const modalDialog = screen.getByRole('dialog');
    const saveBtn = modalDialog.querySelector('button[type="submit"]');
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(screen.getByText('Renamed Assignment By Faculty Lead')).toBeInTheDocument();
    });
  });
});
