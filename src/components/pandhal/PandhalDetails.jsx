import React from 'react';
import { Modal } from '../common/Modal';
import { PandhalGallery } from './PandhalGallery';

export function PandhalDetails({ 
  pandhal, 
  isOpen, 
  onClose, 
  onVoteClick, 
  onShareClick 
}) {
  if (!pandhal) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="850px" ariaLabel={`${pandhal.name} Photo Experience`}>
      <PandhalGallery 
        pandhal={pandhal}
        onVoteClick={onVoteClick}
        onShareClick={onShareClick}
        onClose={onClose}
      />
    </Modal>
  );
}
