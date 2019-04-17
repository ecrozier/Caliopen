import { isUserParticipant } from '../../modules/message';

// Array.prototype.sort() is destructive, hence we need a copy of messages array.
export const sortMessages = (messages, reversed = false) => [...messages].sort((a, b) => {
  if (reversed) {
    return new Date(b.date_sort) - new Date(a.date_sort);
  }

  return new Date(a.date_sort) - new Date(b.date_sort);
});

export const renderParticipant = participant => `${participant.label}` || `(${participant.address})`;

export const getLastMessage = messages => sortMessages(messages, true)[0];

export const getAuthor = message => message.participants && message.participants
  .find(participant => participant.type === 'From');

export const getRecipients = message => message.participants && message.participants
  .filter(participant => participant.type !== 'From');

export const getRecipientsExceptUser = (message, user) => getRecipients(message)
  .filter(participant => !isUserParticipant({ participant, user }));

export const getParticipantsExceptUser = (message, user) => message.participants &&
  message.participants.filter(participant => !isUserParticipant({ participant, user }));

export const isMessageFromUser = (message, user) => {
  const author = getAuthor(message);

  return isUserParticipant({ participant: author, user });
};

export const isUserRecipient = (message, user) => getRecipients(message)
  .some(recipient => isUserParticipant({ participant: recipient, user }));

export const getParticipantsContactIds = ({ participants }) => participants
  .reduce((acc, participant) => {
    const { contact_ids: contactIds } = participant;
    if (contactIds && contactIds.length > 0) {
      return [...acc, ...contactIds];
    }

    throw new Error(`No contact for participant ${participant.label}, cannot encrypt`);
  }, []);

export const getParticipantsAddresses = ({ participants }) => participants
  .map(participant => participant.address);
