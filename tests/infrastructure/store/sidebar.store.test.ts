import { useSidebarStore } from '@/infrastructure/store/sidebar.store';

describe('useSidebarStore', () => {
  beforeEach(() => {
    useSidebarStore.setState({ isOpen: false, isCollapsed: false });
  });

  it('has initial isOpen as false', () => {
    expect(useSidebarStore.getState().isOpen).toBe(false);
  });

  it('toggle flips isOpen', () => {
    useSidebarStore.getState().toggle();
    expect(useSidebarStore.getState().isOpen).toBe(true);

    useSidebarStore.getState().toggle();
    expect(useSidebarStore.getState().isOpen).toBe(false);
  });

  it('setOpen sets isOpen to true', () => {
    useSidebarStore.getState().setOpen(true);
    expect(useSidebarStore.getState().isOpen).toBe(true);
  });

  it('setOpen sets isOpen to false', () => {
    useSidebarStore.setState({ isOpen: true });
    useSidebarStore.getState().setOpen(false);
    expect(useSidebarStore.getState().isOpen).toBe(false);
  });

  it('setCollapsed sets isCollapsed to true', () => {
    useSidebarStore.getState().setCollapsed(true);
    expect(useSidebarStore.getState().isCollapsed).toBe(true);
  });

  it('setCollapsed sets isCollapsed to false', () => {
    useSidebarStore.setState({ isCollapsed: true });
    useSidebarStore.getState().setCollapsed(false);
    expect(useSidebarStore.getState().isCollapsed).toBe(false);
  });
});
