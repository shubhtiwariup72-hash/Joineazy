import React from 'react';

const UserItem = ({ item, index, deleteData }) => {
    return (
        <article className="home__person" key={`${item.userId}-${index}`}>
            <div className="home__avatar" aria-hidden="true">
                {(item.title || '?').charAt(0).toUpperCase()}
            </div>
            <div className="home__person-body">
                <h3 className="home__person-name">{item.title}</h3>
                <dl className="home__person-meta">
                    <div>
                        <dt>User ID</dt>
                        <dd>{item.userId || '—'}</dd>
                    </div>
                    <div>
                        <dt>ID</dt>
                        <dd>{item.id || '—'}</dd>
                    </div>
                    <div>
                        <dt>Description</dt>
                        <dd style={{ textTransform: 'capitalize' }}>{item.body || '—'}</dd>
                    </div>
                </dl>
            </div>
            <button
                type="button"
                className="home__btn home__btn--danger"
                onClick={() => deleteData(item.id)}
                aria-label={`Delete`}
            >
                Delete
            </button>
        </article>
    )
}

export default UserItem