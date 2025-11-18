/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  const user_desc = 'Мой \'последний самурай\': \n 1jz-gte (турбина, 280 л.с.), диски - \“Крутые диски\”';
  const current_date = new Date();

  await knex('users').insert([
    {
      email: 'admin@yandex.ru',
      password: 'admin34',
      name: 'ApaXuc',
      profile_photo_path: 'profilePhotos/templateProfilePhoto.jpg',
      users_status_text: 'Несколько раз намотался на столб =)',
      users_car_desc: `${user_desc}`
    },
    {
      email: 'callika@yandex.ru',
      password: 'admin35',
      name: 'LLIypKa',
      profile_photo_path: 'profilePhotos/templateProfilePhoto.jpg',
      users_status_text: 'Ни столба тебе, ни жезла, самурай',
      users_car_desc: `${user_desc}`
    }
  ]);

  await knex('articles').insert([
    {
      title: 'Приветствие', 
      text_content: 'ХИХИХАХА, марк 2 в поисках столба', 
      author_id: 1, 
      created_at: current_date
    },
    {
      title: 'Напутствие', 
      text_content: 'У самурая нет цели - есть только путь', 
      author_id: 2, 
      created_at: current_date
    }
  ]);

  await knex('comments').insert([
    {
      article_id: 1,
      author_id: 2,
      text_content: 'Столб найден', 
      created_at: current_date
    },
    {
      article_id: 2,
      author_id: 1,
      text_content: 'Ведь путь самурая - это, по сути, его цель? Не так ли?', 
      created_at: current_date
    }
  ]);

  await knex('car_desc_photos').insert([
    {
      user_id: 1, 
      photo_path: 'usersCarsPhotos/templateStatusPhoto.jpg'
    },
    {
      user_id: 2, 
      photo_path: 'usersCarsPhotos/templateStatusPhoto.jpg'
    }
  ]);

  await knex('user_status_photos').insert([
    {
      user_id: 1, 
      photo_path: 'usersStatusPhotos/templateStatusPhoto.jpg'
    },
    {
      user_id: 2, 
      photo_path: 'usersStatusPhotos/templateStatusPhoto.jpg'
    }
  ]);
};
