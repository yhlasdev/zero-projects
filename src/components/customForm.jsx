export const CustomForm = ({ handleSubmit, children }) => {
    return (
        <form onSubmit={handleSubmit}>
            {children}
        </form>
    )
}