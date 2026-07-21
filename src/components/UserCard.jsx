import React from 'react';

const UserCard = ({item, index, deleteData}) => {
    return (
        <article className="home__person" key={`${item.email}-${index}`}>
            <div className="home__avatar" aria-hidden="true">
                {(item.name || '?').charAt(0).toUpperCase()}
            </div>
            <div className="home__person-body">
                <h3 className="home__person-name">{item.name}</h3>
                <dl className="home__person-meta">
                    <div>
                        <dt>Age</dt>
                        <dd>{item.age || '—'}</dd>
                    </div>
                    <div>
                        <dt>Location</dt>
                        <dd>{item.address || '—'}</dd>
                    </div>
                    <div>
                        <dt>Email</dt>
                        <dd>
                            <a href={`mailto:${item.email}`}>{item.email || '—'}</a>
                        </dd>
                    </div>
                    <div>
                        <dt>Phone</dt>
                        <dd>
                            <a href={`tel:${item.phone}`}>{item.phone || '—'}</a>
                        </dd>
                    </div>
                </dl>
            </div>
            <button
                type="button"
                className="home__btn home__btn--danger"
                onClick={() => deleteData(item.name)}
                aria-label={`Delete ${item.name}`}
            >
                Delete
            </button>
        </article>
    )
}

export default UserCard