import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from '@xd/button';
import { ButtonGroup } from '../index';

describe('ButtonGroup', () => {
  it('renders children inside a group role', () => {
    render(
      <ButtonGroup aria-label="Text alignment">
        <Button>Left</Button>
        <Button>Center</Button>
      </ButtonGroup>,
    );

    const group = screen.getByRole('group', { name: /text alignment/i });
    expect(screen.getByRole('button', { name: /left/i })).toBeInTheDocument();
    expect(group).toContainElement(
      screen.getByRole('button', { name: /left/i }),
    );
    expect(group).toContainElement(
      screen.getByRole('button', { name: /center/i }),
    );
  });
});
