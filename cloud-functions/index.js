const functions = require('firebase-functions');
const admin = require('firebase-admin');
const supabase = require('./supabase-client');

admin.initializeApp();

exports.processNewChapter = functions.firestore
  .document('chapters/{chapterId}')
  .onCreate(async (snap, context) => {
    const chapter = snap.data();
    
    // Send notification to moderators
    await supabase
      .from('notifications')
      .insert({
        user_id: chapter.narrator_id,
        message: `New chapter submitted for review`,
        type: 'chapter_submission'
      });
    
    return true;
  });