use('shm-chat');

db.messages.aggregate([
  {
    $match: {
      body: { $regex: /паровоз/ },
    },
  },
  {
    $group: {
      _id: null,
      totalCount: { $sum: 1 },
    },
  },
]);
